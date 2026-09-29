import type { Db } from "@/lib/db/db";
import { getPoll } from "./polls";

export type VoteRejectionReason = 
  | "poll-not-found"
  | "poll-closed"
  | "no-selection"
  | "too-many-selections"
  | "unknown-option"
  | "duplicate-selection";

/** 규칙에 맞지 않는 Vote를 거부할 때 던진다. */
export class VoteRejectedError extends Error {
  override name = "VoteRejectedError";
  constructor(readonly reason: VoteRejectionReason) {
    super(`Vote rejected: ${reason}`);
  }
}

/** Vote 하나를 기록한다. ADR-0001에 따라 Voter를 식별하는 정보는 받지도 저장하지도 않는다. */
export async function castVote(db: Db, pollId: string, optionIds: string[]): Promise<void> {
  const poll = await getPoll(db, pollId);
  if (!poll) throw new VoteRejectedError("poll-not-found");
  if (optionIds.length === 0) throw new VoteRejectedError("no-selection");
  if (new Set(optionIds).size !== optionIds.length) throw new VoteRejectedError("duplicate-selection");
  if (optionIds.length > poll.selectionLimit) throw new VoteRejectedError("too-many-selections");
  const pollOptionIds = new Set(poll.options.map((o) => o.id));
  if (!optionIds.every((id) => pollOptionIds.has(id))) throw new VoteRejectedError("unknown-option");

  // Open 확인과 기록을 한 문장으로 처리한다. FOR SHARE 때문에 동시에 들어온 마감은 이 Vote가 끝날 때까지 기다린다.
  // ADR-0002: Operator가 마감하지 않았어도 Closing time이 지났으면 Closed다. 기준은 DB 시각이다.
  const inserted = await db.query(
    `WITH p AS (SELECT id FROM polls WHERE id = $1 AND status = 'open' AND closes_at > now() FOR SHARE),
     v AS (INSERT INTO votes (poll_id) SELECT id FROM p RETURNING id)
     INSERT INTO vote_selections (vote_id, option_id)
     SELECT v.id, o FROM v, unnest($2::bigint[]) AS o
     RETURNING vote_id`,
    [pollId, optionIds],
  );
  if (inserted.length === 0) throw new VoteRejectedError("poll-closed");
}
