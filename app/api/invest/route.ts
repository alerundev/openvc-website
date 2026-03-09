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

    const res = await fetch(webhookUrl, {
      method: "POST",
      body: discordForm,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Discord webhook error:", errText);
      return NextResponse.json({ error: "전송에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
