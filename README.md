This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 설정

`.env.local`에 다음 환경변수를 둔다(저장소에는 커밋하지 않는다).

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | Neon Postgres 연결 문자열 |
| `OPERATOR_TOKEN` | 모든 운영자가 공유하는 로그인 토큰(ADR-0001). 추측하기 어려운 긴 무작위 값을 쓴다. 예: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. 바꾸면 기존 운영자 세션이 모두 로그아웃된다. |

DB 스키마는 `npm run db:migrate`로 적용하고, 테스트는 `npm test`로 돌린다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
