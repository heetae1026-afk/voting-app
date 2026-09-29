import { describe, expect, test } from "vitest";
import { closingTimeInputRange, defaultClosingTime, parseKstInputValue, toKstInputValue } from "./kst";

describe("KST 입력값", () => {
  test("UTC 시각을 KST 날짜·시각 입력값으로 바꾼다 (UTC 자정 전후로 날짜가 바뀐다)", () => {
    expect(toKstInputValue(new Date("2026-09-30T15:30:00Z"))).toBe("2026-10-01T00:30");
  });

  test("입력값을 KST로 해석한다", () => {
    expect(parseKstInputValue("2026-10-03T18:00")).toEqual(new Date("2026-10-03T09:00:00Z"));
  });

  test.each(["", "2026-10-03", "2026-10-03 18:00", "2026-13-03T18:00", "abc"])("형식이 잘못된 입력값 %j는 null", (v) => {
    expect(parseKstInputValue(v)).toBeNull();
  });
});

describe("defaultClosingTime", () => {
  test("3일 뒤를 다음 정시로 올린다", () => {
    expect(defaultClosingTime(new Date("2026-09-30T09:12:34Z"))).toEqual(new Date("2026-10-03T10:00:00Z"));
  });

  test("3일 뒤가 이미 정시면 그대로 둔다", () => {
    expect(defaultClosingTime(new Date("2026-09-30T09:00:00Z"))).toEqual(new Date("2026-10-03T09:00:00Z"));
  });
});

describe("closingTimeInputRange", () => {
  test("기본값은 3일 뒤 정시, 최소는 10분 뒤(분 올림), 최대는 30일 뒤(분 내림)를 KST로 준다", () => {
    expect(closingTimeInputRange(new Date("2026-09-30T09:12:34Z"))).toEqual({
      defaultValue: "2026-10-03T19:00",
      min: "2026-09-30T18:23",
      max: "2026-10-30T18:12",
    });
  });
});
