import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createOperatorSession,
  isOperatorToken,
  OPERATOR_SESSION_TTL_MS,
  verifyOperatorSession,
} from "./operator-session";

export { safeReturnPath } from "./operator-session";

// ADR-0001: 모든 Operator가 공유하는 단일 토큰. 서버 환경변수에만 둔다.
const operatorToken = () => process.env.OPERATOR_TOKEN || undefined;

const COOKIE_NAME = "operator_session";

export const isOperatorTokenConfigured = () => operatorToken() !== undefined;

export async function isOperator(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return verifyOperatorSession(value, operatorToken(), new Date());
}

/**
 * Operator가 아니면 로그인 화면으로 보낸다. 모든 Operator 전용 페이지와 Server Function이 매번 호출한다.
 * 화면에서 숨기는 것만으로는 막을 수 없으므로(요청은 UI를 거치지 않고도 보낼 수 있다) 여기서 확인한다.
 */
export async function requireOperator(returnTo?: string): Promise<void> {
  if (await isOperator()) return;
  redirect(returnTo ? `/operator/login?next=${encodeURIComponent(returnTo)}` : "/operator/login");
}

/** 입력한 토큰이 맞으면 세션 쿠키를 발급하고 true를 돌려준다. Server Function에서만 호출한다. */
export async function signInOperator(input: string): Promise<boolean> {
  const token = operatorToken();
  if (!isOperatorToken(input, token)) return false;
  (await cookies()).set(COOKIE_NAME, createOperatorSession(token!, new Date()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OPERATOR_SESSION_TTL_MS / 1000,
  });
  return true;
}

/** Server Function에서만 호출한다. */
export async function signOutOperator(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
