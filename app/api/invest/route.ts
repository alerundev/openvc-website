import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const ANALYSIS_PROMPT = `당신은 10년 이상 경력의 벤처캐피탈 심사역입니다. 첨부된 IR 자료를 검토하고 아래 형식에 맞춰 투자 검토 의견을 작성해주세요.

## 분석 지침

- 객관적이고 비판적인 시각으로 분석하세요.
- 장점은 인정하되, 리스크와 약점도 명확히 짚어주세요.
- 투자 가능성을 별점(★)으로 표현하세요 (5점 만점).
- 전문 용어보다 명확한 언어를 사용하세요.
- 내용이 불충분하거나 IR 자료가 아닌 경우에도 분석 가능한 범위 내에서 검토 의견을 제시하세요.

## 출력 형식 (Discord Markdown)

아래 섹션을 순서대로 작성하세요:

**1. 서비스/사업 개요** — 무엇을 하는 회사인지 2~3줄 요약

**2. 팀** — 창업자/핵심 인력의 역량과 도메인 적합성

**3. 시장** — 시장 규모, 성장성, 타이밍

**4. 비즈니스 모델** — 수익 구조의 명확성과 지속 가능성

**5. 경쟁 우위** — 차별점, 기술/네트워크/브랜드 해자 여부

**6. 재무 및 투자 활용** — 현재 재무 상황, 투자금 사용 계획의 합리성

**7. 주요 리스크** — 투자 전 반드시 확인해야 할 핵심 리스크 3가지

**8. 종합 의견** — 투자 가능성 평가 (★☆☆☆☆ ~ ★★★★★) 및 한 줄 요약

**9. 후속 조치** — 다음 미팅에서 확인할 질문 2~3가지`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const file = formData.get("file") as File | null;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: "서버 설정 오류입니다." }, { status: 500 });
    }

    // 1. Discord 포럼에 포스팅 생성
    const discordForm = new FormData();
    const payload = {
      thread_name: `[투자문의] ${name}`,
      content: [
        "## 📬 새로운 투자 문의가 접수되었습니다",
        "",
        `**이름** ${name}`,
        `**전화번호** ${phone}`,
        `**이메일** ${email}`,
        "",
        file
          ? `📎 IR 자료: \`${file.name}\` (${(file.size / 1024 / 1024).toFixed(2)}MB)`
          : "📎 IR 자료: 첨부 없음",
        "",
        "*🤖 AI 투자 검토 의견을 생성 중입니다...*",
      ].join("\n"),
    };

    discordForm.append("payload_json", JSON.stringify(payload));

    let fileBuffer: ArrayBuffer | null = null;
    if (file) {
      fileBuffer = await file.arrayBuffer();
      const blob = new Blob([fileBuffer], { type: file.type });
      discordForm.append("files[0]", blob, file.name);
    }

    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      body: discordForm,
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error("Discord webhook error:", errText);
      return NextResponse.json({ error: "전송에 실패했습니다." }, { status: 500 });
    }

    const threadData = await discordRes.json().catch(() => null);
    const threadId = threadData?.id;

    // 2. Anthropic으로 PDF 분석 (비동기 — 사용자 응답 차단 안 함)
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && threadId) {
      analyzeAndReply({ apiKey, name, email, file, fileBuffer, threadId }).catch((e) =>
        console.error("AI analysis error:", e)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

async function analyzeAndReply({
  apiKey,
  name,
  email,
  file,
  fileBuffer,
  threadId,
}: {
  apiKey: string;
  name: string;
  email: string;
  file: File | null;
  fileBuffer: ArrayBuffer | null;
  threadId: string;
}) {
  const client = new Anthropic({ apiKey });

  let analysisText = "";

  try {
    if (file && fileBuffer) {
      // PDF를 base64로 변환하여 Claude에 전달
      const base64Pdf = Buffer.from(fileBuffer).toString("base64");

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64Pdf,
                },
              },
              {
                type: "text",
                text: ANALYSIS_PROMPT,
              },
            ],
          },
        ],
      });

      analysisText =
        response.content[0].type === "text" ? response.content[0].text : "분석 결과를 가져올 수 없습니다.";
    } else {
      // IR 자료 없는 경우
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: `투자 문의자 정보:\n이름: ${name}\n이메일: ${email}\n\nIR 자료가 첨부되지 않았습니다. 이 상황에 맞는 간단한 안내 메시지를 작성해주세요.`,
          },
        ],
      });

      analysisText =
        response.content[0].type === "text" ? response.content[0].text : "분석 결과를 가져올 수 없습니다.";
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Anthropic API error:", errMsg);
    analysisText = `⚠️ AI 분석 중 오류가 발생했습니다. 수동으로 검토 부탁드립니다.\n\`\`\`\n${errMsg}\n\`\`\``;
  }

  // 3. 분석 결과를 Discord 스레드에 댓글로 전달
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return;

  await fetch(`https://discord.com/api/v10/channels/${threadId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: `## 🤖 AI 투자 검토 의견\n\n${analysisText}`,
    }),
  });
}
