import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isOperator, safeReturnPath } from "@/lib/auth/operator";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "운영자 로그인" };

export default async function OperatorLoginPage(props: PageProps<"/operator/login">) {
  const { next } = await props.searchParams;
  const nextPath = typeof next === "string" ? next : undefined;
  if (await isOperator()) redirect(safeReturnPath(nextPath));

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">운영자 로그인</h1>
        <p className="text-sm text-zinc-500">운영진이 함께 쓰는 운영자 토큰을 입력하세요.</p>
      </div>
      <SignInForm next={nextPath} />
    </main>
  );
}
