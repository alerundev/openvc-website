import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open VC — 미래를 만드는 기업에 투자합니다",
  description:
    "Open VC는 혁신적인 스타트업과 함께 더 나은 미래를 만들어가는 벤처캐피탈입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans bg-white text-black antialiased">{children}</body>
    </html>
  );
}
