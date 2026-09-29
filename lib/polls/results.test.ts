import { beforeEach, describe, expect, test } from "vitest";
import type { Db } from "@/lib/db/db";
import { createTestDb } from "@/lib/db/test-db";
import { closePoll } from "./polls";
import { makePoll, makePollPastClosingTime, optionId } from "./test-fixtures";
import { getResult } from "./results";
import { castVote } from "./votes";

let db: Db;

beforeEach(async () => {
  db = await createTestDb();
});

describe("getResult", () => {
  test("Voter는 Open Poll의 Result를 볼 수 없다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });
    await castVote(db, poll.id, [optionId(poll, "가평")]);

    expect(await getResult(db, poll.id, "voter")).toEqual({ visibility: "hidden" });
  });

  test("Poll이 Closed되면 Voter도 Option별 선택 수와 비율, 전체 Vote 수를 본다", async () => {
    const poll = await makePoll(db, { options: ["김", "이", "박", "최"], selectionMode: "multiple", selectionLimit: 2 });
    await castVote(db, poll.id, [optionId(poll, "김"), optionId(poll, "이")]);
    await castVote(db, poll.id, [optionId(poll, "김")]);
    await castVote(db, poll.id, [optionId(poll, "김"), optionId(poll, "박")]);
    await castVote(db, poll.id, [optionId(poll, "이")]);
    await closePoll(db, poll.id);

    const view = await getResult(db, poll.id, "voter");

    // Multiple Poll의 비율은 전체 Vote 수 대비라 합이 100%를 넘는다.
    expect(view).toEqual({
      visibility: "visible",
      result: {
        totalVotes: 4,
        options: [
          { id: optionId(poll, "김"), label: "김", count: 3, ratio: 0.75 },
          { id: optionId(poll, "이"), label: "이", count: 2, ratio: 0.5 },
          { id: optionId(poll, "박"), label: "박", count: 1, ratio: 0.25 },
          { id: optionId(poll, "최"), label: "최", count: 0, ratio: 0 },
        ],
      },
    });
  });

  test("없는 Poll이면 null을 돌려준다", async () => {
    expect(await getResult(db, "no-such-poll", "voter")).toBeNull();
  });

  test("Operator는 Open Poll의 Result도 본다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });
    await castVote(db, poll.id, [optionId(poll, "양평")]);

    const view = await getResult(db, poll.id, "operator");

    expect(view).toMatchObject({ visibility: "visible", result: { totalVotes: 1 } });
  });

  test("Vote가 없는 Poll의 Result는 모든 수와 비율이 0이다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });
    await closePoll(db, poll.id);

    const view = await getResult(db, poll.id, "voter");

    expect(view).toEqual({
      visibility: "visible",
      result: {
        totalVotes: 0,
        options: [
          { id: optionId(poll, "가평"), label: "가평", count: 0, ratio: 0 },
          { id: optionId(poll, "양평"), label: "양평", count: 0, ratio: 0 },
        ],
      },
    });
  });

  test("Closing time이 지나면 Operator가 마감하지 않았어도 Voter가 Result를 본다", async () => {
    const poll = await makePollPastClosingTime(db);

    expect(await getResult(db, poll.id, "voter")).toMatchObject({ visibility: "visible", result: { totalVotes: 0 } });
  });
});
