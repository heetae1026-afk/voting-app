import { isOperator } from "@/lib/auth/operator";
import { signOutAction } from "./auth-actions";

// 로그아웃 버튼 표시용일 뿐, 접근 제어는 각 페이지와 Server Function의 requireOperator가 맡는다.
export default async function OperatorLayout({ children }: LayoutProps<"/operator">) {
  const signedIn = await isOperator();
  return (
    <>
      {signedIn && (
        <header className="flex justify-end px-4 py-3">
          <form action={signOutAction}>
            <button type="submit" className="text-sm text-zinc-500 underline">
              로그아웃
            </button>
          </form>
        </header>
      )}
      {children}
    </>
  );
}
