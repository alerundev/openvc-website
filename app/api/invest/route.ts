import { NextRequest, NextResponse } from "next/server";

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
        file ? `📎 IR 자료: \`${file.name}\` (${(file.size / 1024 / 1024).toFixed(2)}MB)` : "📎 IR 자료: 첨부 없음",
      ].join("\n"),
    };

    discordForm.append("payload_json", JSON.stringify(payload));

    if (file) {
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: file.type });
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

    // 2. OpenClaw에 분석 요청 (비동기 — 사용자 응답 차단 안 함)
    const openclawUrl = process.env.OPENCLAW_GATEWAY_URL;
    const openclawToken = process.env.OPENCLAW_GATEWAY_TOKEN;

    if (openclawUrl && openclawToken) {
      // Discord 포스팅 생성 후 약간 대기 (파일 업로드 완료 시간)
      const threadInfo = await discordRes.json().catch(() => null);
      const threadId = threadInfo?.id;

      const triggerMessage = file
        ? `새로운 투자 문의가 접수되었습니다.\n이름: ${name} / 이메일: ${email}\n포럼 스레드 ID: ${threadId ?? "확인 필요"}\n투자문의 포럼 채널(1480407447888728136)에서 미처리 포스팅을 확인하고 PDF를 분석하여 투자 검토 의견을 댓글로 달아주세요.`
        : `새로운 투자 문의가 접수되었습니다 (IR 자료 없음).\n이름: ${name} / 이메일: ${email}`;

      // fire-and-forget
      fetch(`${openclawUrl}/tools/invoke`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openclawToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: "sessions_send",
          args: {
            sessionKey: "main",
            message: triggerMessage,
          },
        }),
      }).catch((e) => console.error("OpenClaw trigger error:", e));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
