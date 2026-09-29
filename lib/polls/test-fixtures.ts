// 테스트 전용. Poll을 만드는 기본값을 한 곳에 모아, Poll 정의에 필수 항목이 늘어도 여기만 고치면 되게 한다.
import type { Db } from "@/lib/db/db";
import { createPoll, getPoll, type NewPoll, type Poll } from "./polls";

/** 규칙에 맞는 Poll 정의. 테스트가 관심 있는 항목만 덮어쓴다. */
export function newPoll(overrides: Partial<NewPoll> = {}): NewPoll {
  return {
    question: "테스트 질문",
    options: ["가평", "양평"],
    selectionMode: "single",
    closesAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    ...overrides,
  };
}

/** Poll을 만들고, 만든 Poll을 읽어서 돌려준다. */
export async function makePoll(db: Db, overrides: Partial<NewPoll> = {}): Promise<Poll> {
  const { id } = await createPoll(db, newPoll(overrides));
  return (await getPoll(db, id))!;
}

/**
 * Closing time이 이미 지난 Poll을 만든다. createPoll에 과거의 "지금"(1시간 전)을 주고
 * 그로부터 30분 뒤(= 지금부터 30분 전)를 Closing time으로 둔다. Operator가 마감하지는 않았다.
 */
export async function makePollPastClosingTime(db: Db, overrides: Partial<NewPoll> = {}): Promise<Poll> {
  const now = Date.now();
  const { id } = await createPoll(db, newPoll({ closesAt: new Date(now - 30 * 60 * 1000), ...overrides }), {
    now: new Date(now - 60 * 60 * 1000),
  });
  return (await getPoll(db, id))!;
}

export const optionId = (poll: Poll, label: string) => poll.options.find((o) => o.label === label)!.id;
