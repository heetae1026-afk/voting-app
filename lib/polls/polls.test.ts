import { beforeEach, describe, expect, test } from "vitest";
import type { Db } from "@/lib/db/db";
import { createTestDb } from "@/lib/db/test-db";
import { createPoll, getPoll, type PollDefinitionReason } from "./polls";
import { makePoll, makePollPastClosingTime, newPoll } from "./test-fixtures";

let db: Db;

/** createPoll이 해당 사유의 PollDefinitionError로 거부되어야 함을 나타낸다. */
function rejectedFor(reason: PollDefinitionReason) {
  return { name: "PollDefinitionError", reason };
}

beforeEach(async () => {
  db = await createTestDb();
});

describe("createPoll", () => {
  test("만든 Poll은 질문과 Option을 입력한 순서대로 다시 읽을 수 있다", async () => {
    const { id } = await createPoll(db, newPoll({
      question: "다음 MT 장소는?",
      options: ["가평", "양평", "춘천"],
      selectionMode: "single",
    }));

    const poll = await getPoll(db, id);

    expect(poll).toMatchObject({
      id,
      question: "다음 MT 장소는?",
      selectionMode: "single",
      selectionLimit: 1,
      status: "open",
    });
    expect(poll?.options.map((o) => o.label)).toEqual(["가평", "양평", "춘천"]);
  });

  test("Option이 2개 미만이면 만들 수 없다", async () => {
    await expect(
      createPoll(db, newPoll({ question: "찬성하십니까?", options: ["찬성"], selectionMode: "single" })),
    ).rejects.toMatchObject(rejectedFor("too-few-options"));
  });

  test("공백만 있는 Option이 있으면 만들 수 없다", async () => {
    await expect(
      createPoll(db, newPoll({ question: "찬성하십니까?", options: ["찬성", "   "], selectionMode: "single" })),
    ).rejects.toMatchObject(rejectedFor("empty-option"));
  });

  test("앞뒤 공백을 빼고 같은 Option이 두 개 있으면 만들 수 없다", async () => {
    await expect(
      createPoll(db, newPoll({ question: "회장 선거", options: ["김철수", " 김철수 "], selectionMode: "single" })),
    ).rejects.toMatchObject(rejectedFor("duplicate-option"));
  });

  test("질문이 공백뿐이면 만들 수 없다", async () => {
    await expect(
      createPoll(db, newPoll({ question: "  ", options: ["찬성", "반대"], selectionMode: "single" })),
    ).rejects.toMatchObject(rejectedFor("empty-question"));
  });

  test("Multiple Poll은 정한 Selection limit을 가진다", async () => {
    const { id } = await createPoll(db, newPoll({
      question: "운영위원 선출 (최대 2명)",
      options: ["김철수", "이영희", "박민수"],
      selectionMode: "multiple",
      selectionLimit: 2,
    }));

    expect(await getPoll(db, id)).toMatchObject({ selectionMode: "multiple", selectionLimit: 2 });
  });

  test.each([
    { selectionLimit: undefined, why: "없음" },
    { selectionLimit: 1, why: "2 미만" },
    { selectionLimit: 4, why: "Option 수(3) 초과" },
    { selectionLimit: 2.5, why: "정수가 아님" },
  ])("Multiple Poll의 Selection limit이 잘못되면 만들 수 없다: $why", async ({ selectionLimit }) => {
    await expect(
      createPoll(db, newPoll({
        question: "운영위원 선출",
        options: ["김철수", "이영희", "박민수"],
        selectionMode: "multiple",
        selectionLimit,
      })),
    ).rejects.toMatchObject(rejectedFor("invalid-selection-limit"));
  });
});

describe("createPoll: Closing time", () => {
  const now = new Date("2026-09-30T09:00:00Z");

  test("만든 Poll은 정한 Closing time을 가진다", async () => {
    const closesAt = new Date("2026-10-03T09:00:00Z");
    const { id } = await createPoll(db, newPoll({ closesAt }), { now });

    expect((await getPoll(db, id))?.closesAt).toEqual(closesAt);
  });

  test.each([
    { closesAt: new Date("2026-09-30T08:00:00Z"), why: "이미 지난 시각" },
    { closesAt: new Date("2026-09-30T09:09:59Z"), why: "10분보다 가까움" },
    { closesAt: new Date("2026-10-30T09:00:01Z"), why: "30일보다 멂" },
    { closesAt: new Date("not a date"), why: "잘못된 날짜" },
  ])("Closing time이 허용 범위 밖이면 만들 수 없다: $why", async ({ closesAt }) => {
    await expect(createPoll(db, newPoll({ closesAt }), { now })).rejects.toMatchObject(
      rejectedFor("invalid-closing-time"),
    );
  });

  test.each([
    { closesAt: new Date("2026-09-30T09:10:00Z"), why: "정확히 10분 뒤" },
    { closesAt: new Date("2026-10-30T09:00:00Z"), why: "정확히 30일 뒤" },
  ])("Closing time이 경계값이면 만들 수 있다: $why", async ({ closesAt }) => {
    await expect(createPoll(db, newPoll({ closesAt }), { now })).resolves.toHaveProperty("id");
  });
});

describe("getPoll", () => {
  test("없는 Poll ID면 null을 돌려준다", async () => {
    expect(await getPoll(db, "no-such-poll")).toBeNull();
  });
});

describe("Open / Closed", () => {
  test("Closing time 전의 Poll은 Open이다", async () => {
    expect((await makePoll(db)).status).toBe("open");
  });

  test("Closing time이 지난 Poll은 Operator가 마감하지 않았어도 Closed다", async () => {
    expect((await makePollPastClosingTime(db)).status).toBe("closed");
  });
});
