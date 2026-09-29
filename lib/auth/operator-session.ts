import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const digest = (value: string) => createHash("sha256").update(value).digest();

/**
 * 입력한 값이 Operator token인지 상수 시간으로 비교한다.
 * 두 값을 같은 길이의 해시로 바꿔 비교하므로, 길이나 내용이 응답 시간으로 드러나지 않는다.
 * 서버에 토큰이 없거나 비어 있으면 항상 거부한다.
 */
export function isOperatorToken(input: string, expected: string | undefined): boolean {
  if (!expected) return false;
  return timingSafeEqual(digest(input), digest(expected));
}

/** Operator 세션의 유효 기간. */
export const OPERATOR_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// 서명 키를 Operator token에서 파생한다. 토큰을 바꾸면 기존 세션이 모두 무효가 된다.
const sign = (token: string, payload: string) =>
  createHmac("sha256", createHmac("sha256", token).update("operator-session").digest())
    .update(payload)
    .digest("base64url");

/**
 * "Operator임"과 만료 시각만 담은 서명된 세션 값을 만든다. 형식: `<만료 ms>.<서명>`.
 */
export function createOperatorSession(token: string, now: Date): string {
  const expiresAt = String(now.getTime() + OPERATOR_SESSION_TTL_MS);
  return `${expiresAt}.${sign(token, `operator.${expiresAt}`)}`;
}

/** 세션 값이 지금의 Operator token으로 서명되었고 만료되지 않았는지 확인한다. */
export function verifyOperatorSession(value: string | undefined, token: string | undefined, now: Date): boolean {
  if (!value || !token) return false;
  const [expiresAt, signature] = value.split(".");
  if (!expiresAt || !signature) return false;
  if (!(Number(expiresAt) > now.getTime())) return false;
  return timingSafeEqual(digest(signature), digest(sign(token, `operator.${expiresAt}`)));
}

/** 로그인 후 돌아갈 경로. 외부 주소로 보내는 열린 리다이렉트를 막기 위해 Operator 화면 경로만 허용한다. */
export function safeReturnPath(next: unknown): string {
  return typeof next === "string" && /^\/operator\/(?!login)/.test(next) ? next : "/operator/polls/new";
}
