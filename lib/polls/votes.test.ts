import { beforeEach, describe, expect, test } from "vitest";
import type { Db } from "@/lib/db/db";
import { createTestDb } from "@/lib/db/test-db";
import { closePoll } from "./polls";
import { makePoll, optionId } from "./test-fixtures";
import { getResult as viewResult } from "./results";
import { castVote, type VoteRejectionReason } from "./votes";

let db: Db;

beforeEach(async () => {
  db = await createTestDb();
});

/** castVote가 해당 사유의 VoteRejectedError로 거부되어야 함을 나타낸다. */
const rejectedFor = (reason: VoteRejectionReason) => ({ name: "VoteRejectedError", reason });

/** Operator 시점의 Result. 이 파일은 Vote 기록을 확인하는 데만 쓴다. */
async function getResult(pollId: string) {
  const view = await viewResult(db, pollId, "operator");
  if (view?.visibility !== "visible") throw new Error("Operator는 항상 Result를 봐야 한다");
  return view.result;
}

describe("castVote", () => {
  test("Single Poll에 Vote하면 고른 Option의 선택 수와 전체 Vote 수가 1이 된다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });

    await castVote(db, poll.id, [optionId(poll, "양평")]);

    expect(await getResult(poll.id)).toEqual({
      totalVotes: 1,
      options: [
        { id: optionId(poll, "가평"), label: "가평", count: 0, ratio: 0 },
        { id: optionId(poll, "양평"), label: "양평", count: 1, ratio: 1 },
      ],
    });
  });

  test("없는 Poll에는 Vote할 수 없다", async () => {
    await expect(castVote(db, "no-such-poll", ["1"])).rejects.toMatchObject(rejectedFor("poll-not-found"));
  });

  test("Option을 하나도 고르지 않으면 Vote할 수 없다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });

    await expect(castVote(db, poll.id, [])).rejects.toMatchObject(rejectedFor("no-selection"));
  });

  test("Single Poll에서 Option을 두 개 고르면 Vote할 수 없다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });

    await expect(
      castVote(db, poll.id, [optionId(poll, "가평"), optionId(poll, "양평")]),
    ).rejects.toMatchObject(rejectedFor("too-many-selections"));
  });

  test("Multiple Poll에서 Selection limit보다 많이 고르면 Vote할 수 없다", async () => {
    const poll = await makePoll(db, { options: ["김", "이", "박"], selectionMode: "multiple", selectionLimit: 2 });

    await expect(
      castVote(db, poll.id, [optionId(poll, "김"), optionId(poll, "이"), optionId(poll, "박")]),
    ).rejects.toMatchObject(rejectedFor("too-many-selections"));
  });

  test("다른 Poll의 Option으로는 Vote할 수 없다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });
    const other = await makePoll(db, { options: ["찬성", "반대"] });

    await expect(castVote(db, poll.id, [optionId(other, "찬성")])).rejects.toMatchObject(
      rejectedFor("unknown-option"),
    );
  });

  test("형식이 잘못된 Option ID로는 Vote할 수 없다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });

    await expect(castVote(db, poll.id, ["abc"])).rejects.toMatchObject(rejectedFor("unknown-option"));
  });

  test("같은 Option을 두 번 고르면 Vote할 수 없다", async () => {
    const poll = await makePoll(db, { options: ["김", "이", "박"], selectionMode: "multiple", selectionLimit: 2 });

    await expect(
      castVote(db, poll.id, [optionId(poll, "김"), optionId(poll, "김")]),
    ).rejects.toMatchObject(rejectedFor("duplicate-selection"));
  });
});

describe("castVote on a Closed Poll", () => {
  test("Closed Poll에는 Vote할 수 없고, Result도 바뀌지 않는다", async () => {
    const poll = await makePoll(db, { options: ["가평", "양평"] });
    await closePoll(db, poll.id);

    await expect(castVote(db, poll.id, [optionId(poll, "가평")])).rejects.toMatchObject(rejectedFor("poll-closed"));
    expect((await getResult(poll.id)).totalVotes).toBe(0);
  });
});

describe("getResult", () => {
  test("Multiple Poll의 Vote는 고른 Option마다 한 번씩 세고, 전체 Vote 수는 Vote 개수다", async () => {
    const poll = await makePoll(db, { options: ["김", "이", "박"], selectionMode: "multiple", selectionLimit: 2 });

    await castVote(db, poll.id, [optionId(poll, "김"), optionId(poll, "이")]);
    await castVote(db, poll.id, [optionId(poll, "김")]);

    const result = await getResult(poll.id);
    expect(result.totalVotes).toBe(2);
    expect(result.options.map((o) => [o.label, o.count])).toEqual([
      ["김", 2],
      ["이", 1],
      ["박", 0],
    ]);
  });
});
