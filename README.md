# Open VC Website

Open VC 벤처캐피탈 홈페이지. Apple 스타일 디자인.

## 기능

- 회사 소개, 투자 분야, 포트폴리오 소개
- 투자 문의 모달 (이름, 전화번호, 이메일, IR 자료 PDF 첨부)
- 파일 용량 20MB 초과 시 클라이언트 사이드 차단
- Discord 포럼 채널로 문의 자동 전달

## 시작하기

```bash
cp .env.example .env.local
# .env.local 에 Discord Webhook URL 입력

npm install
npm run dev
```

## 환경 변수

| 변수 | 설명 |
|------|------|
| `DISCORD_WEBHOOK_URL` | Discord 포럼 채널 웹훅 URL |

## 배포

Vercel 추천. 환경 변수에 `DISCORD_WEBHOOK_URL` 설정 필요.
