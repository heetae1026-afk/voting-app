"use server";

import { getDb } from "@/lib/db/neon";
import { castVote, VoteRejectedError, type VoteRejectionReason } from "@/lib/polls/votes";

export interface CastVoteState {
  voted?: true;
  error?: VoteRejectionReason;
}

// Voter 인증은 없다(ADR-0001). Poll link를 가진 누구나 호출할 수 있다.
export async function castVoteAction(pollId: string, _prev: CastVoteState, formData: FormData): Promise<CastVoteState> {
  try {
    await castVote(getDb(), pollId, formData.getAll("option").map(String));
  } catch (err) {
    if (err instanceof VoteRejectedError) return { error: err.reason };
    throw err;
  }
  return { voted: true };
}
