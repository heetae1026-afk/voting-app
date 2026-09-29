import { describe, expect, test } from "vitest";
import { createOperatorSession, isOperatorToken, safeReturnPath, verifyOperatorSession } from "./operator-session";

const TOKEN = "club-secret-token-2026";

describe("isOperatorToken", () => {
  test.each([
    { input: TOKEN, expected: TOKEN, ok: true, why: "같은 토큰" },
    { input: "club-secret-token-2025", expected: TOKEN, ok: false, why: "한 글자 다른 토큰" },
    { input: "club", expected: TOKEN, ok: false, why: "길이가 다른 토큰" },
    { input: "", expected: TOKEN, ok: false, why: "빈 입력" },
    { input: "", expected: "", ok: false, why: "서버에 토큰이 비어 있음" },
    { input: "anything", expected: undefined, ok: false, why: "서버에 토큰이 없음" },
  ])("$why이면 $ok", ({ input, expected, ok }) => {
    expect(isOperatorToken(input, expected)).toBe(ok);
  });
});

describe("Operator session", () => {
  const issuedAt = new Date("2026-09-29T09:00:00Z");

  test("발급한 세션은 하루 뒤에도 유효하다", () => {
    const session = createOperatorSession(TOKEN, issuedAt);

    expect(verifyOperatorSession(session, TOKEN, new Date("2026-09-30T09:00:00Z"))).toBe(true);
  });

  test("유효 기간(7일)이 지난 세션은 무효다", () => {
    const session = createOperatorSession(TOKEN, issuedAt);

    expect(verifyOperatorSession(session, TOKEN, new Date("2026-10-06T09:00:01Z"))).toBe(false);
  });

  test("만료 시각을 고쳐 늘린 세션은 무효다", () => {
    const [, signature] = createOperatorSession(TOKEN, issuedAt).split(".");
    const forged = `${new Date("2030-01-01T00:00:00Z").getTime()}.${signature}`;

    expect(verifyOperatorSession(forged, TOKEN, new Date("2026-09-30T09:00:00Z"))).toBe(false);
  });

  test("Operator token을 바꾸면 기존 세션은 무효다", () => {
    const session = createOperatorSession(TOKEN, issuedAt);

    expect(verifyOperatorSession(session, "rotated-token", new Date("2026-09-30T09:00:00Z"))).toBe(false);
  });

  test.each(["", "garbage", "123.", ".abc", "1.2.3"])("형식이 잘못된 세션 값(%j)은 무효다", (value) => {
    expect(verifyOperatorSession(value, TOKEN, issuedAt)).toBe(false);
  });
});

describe("safeReturnPath", () => {
  test("Operator 화면 경로는 그대로 돌려준다", () => {
    expect(safeReturnPath("/operator/polls/abc123")).toBe("/operator/polls/abc123");
  });

  test.each([
    ["https://evil.example/operator/polls"],
    ["//evil.example/operator/polls"],
    ["/p/abc123"],
    ["/operator/login"],
    [undefined],
    [null],
  ])("Operator 화면이 아닌 %j는 기본 경로로 바꾼다", (next) => {
    expect(safeReturnPath(next)).toBe("/operator/polls/new");
  });
});
