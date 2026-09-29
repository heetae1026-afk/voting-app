import type { Db } from "@/lib/db/db";
import { getPoll } from "./polls";

export type Viewer = "operator" | "voter";

export interface Result {
  totalVotes: number;
  /** Poll의 Option 순서대로. ratio는 count ÷ totalVotes(0~1)이며, Vote가 없으면 0이다. */
  options: { id: string; label: string; count: number; ratio: number }[];
}

export type ResultView = { visibility: "hidden" } | { visibility: "visible"; result: Result };

/** Voter에게는 Poll이 Closed된 뒤에만 Result를 보여준다. Operator는 언제든 본다. */
export async function getResult(db: Db, pollId: string, viewer: Viewer): Promise<ResultView | null> {
  const poll = await getPoll(db, pollId);
  if (!poll) return null;
  if (viewer === "voter" && poll.status === "open") return { visibility: "hidden" };

  // 전체 Vote 수와 Option별 선택 수를 한 문장으로 읽어, 투표가 진행 중이어도 같은 시점의 숫자가 되게 한다.
  // Poll에는 Option이 항상 2개 이상이라 total은 첫 행에서 읽을 수 있다.
  const rows = await db.query<{ id: string; label: string; count: number; total: number }>(
    `SELECT o.id::text AS id, o.label, count(s.vote_id)::int AS count,
            (SELECT count(*)::int FROM votes WHERE poll_id = $1) AS total
     FROM options o
     LEFT JOIN vote_selections s ON s.option_id = o.id
     WHERE o.poll_id = $1
     GROUP BY o.id
     ORDER BY o.position`,
    [pollId],
  );
  const total = rows[0]?.total ?? 0;
  const options = rows.map(({ id, label, count }) => ({ id, label, count }));

  return {
    visibility: "visible",
    result: {
      totalVotes: total,
      options: options.map((o) => ({ ...o, ratio: total === 0 ? 0 : o.count / total })),
    },
  };
}
