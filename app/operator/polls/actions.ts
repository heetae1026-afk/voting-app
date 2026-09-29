"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db/neon";
import { closePoll, createPoll, PollDefinitionError, type PollDefinitionReason } from "@/lib/polls/polls";

export interface CreatePollState {
  error?: PollDefinitionReason | "invalid-selection-mode";
}

export async function createPollAction(_prev: CreatePollState, formData: FormData): Promise<CreatePollState> {
  // TODO(Operator 인증 티켓): 여기서 Operator 세션을 확인한다. 지금은 누구나 호출할 수 있다.
  const selectionMode = formData.get("selectionMode");
  if (selectionMode !== "single" && selectionMode !== "multiple") {
    return { error: "invalid-selection-mode" };
  }

  let id: string;
  try {
    ({ id } = await createPoll(getDb(), {
      question: String(formData.get("question") ?? ""),
      options: formData.getAll("option").map(String),
      selectionMode,
      selectionLimit: selectionMode === "multiple" ? Number(formData.get("selectionLimit")) : undefined,
    }));
  } catch (err) {
    if (err instanceof PollDefinitionError) return { error: err.reason };
    throw err;
  }
  redirect(`/operator/polls/${id}`);
}

export async function closePollAction(pollId: string): Promise<void> {
  // TODO(Operator 인증 티켓): 여기서 Operator 세션을 확인한다. 지금은 누구나 호출할 수 있다.
  await closePoll(getDb(), pollId);
  refresh();
}
