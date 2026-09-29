import { CLOSING_TIME_MAX_LEAD_MS, CLOSING_TIME_MIN_LEAD_MS } from "@/lib/polls/polls";

// 이 앱의 모든 시각은 한국 시간(KST, UTC+9, 서머타임 없음)으로 입력받고 보여준다.
// 서버나 브라우저의 시간대 설정에 의존하지 않도록 오프셋을 직접 다룬다.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

/** `<input type="datetime-local">`에 넣을 KST 값("YYYY-MM-DDTHH:mm"). */
export function toKstInputValue(date: Date): string {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm"을 KST로 해석한다. 형식이 틀리거나 없는 날짜면 null. */
export function parseKstInputValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+09:00`);
  // 2월 30일처럼 넘치는 날짜는 되돌렸을 때 입력과 달라진다.
  if (Number.isNaN(date.getTime()) || toKstInputValue(date) !== value) return null;
  return date;
}

/** Closing time 기본값: 지금부터 3일 뒤를 다음 정시로 올린 시각. KST는 UTC와 정시가 같다. */
export function defaultClosingTime(now: Date): Date {
  const threeDaysLater = now.getTime() + 72 * HOUR_MS;
  return new Date(Math.ceil(threeDaysLater / HOUR_MS) * HOUR_MS);
}

const MINUTE_MS = 60 * 1000;

/**
 * 마감 시각 입력칸의 기본값과 허용 범위(KST 입력값). 브라우저에서 1차로 막을 뿐, 최종 검증은 createPoll이 한다.
 */
export function closingTimeInputRange(now: Date): { defaultValue: string; min: string; max: string } {
  const t = now.getTime();
  return {
    defaultValue: toKstInputValue(defaultClosingTime(now)),
    min: toKstInputValue(new Date(Math.ceil((t + CLOSING_TIME_MIN_LEAD_MS) / MINUTE_MS) * MINUTE_MS)),
    max: toKstInputValue(new Date(Math.floor((t + CLOSING_TIME_MAX_LEAD_MS) / MINUTE_MS) * MINUTE_MS)),
  };
}
