"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { requireOperator } from "@/lib/auth/operator";
import { getDb } from "@/lib/db/neon";
import { closePoll, createPoll, PollDefinitionError, type PollDefinitionReason } from "@/lib/polls/polls";
import { parseKstInputValue } from "@/lib/time/kst";

export interface CreatePollState {
  error?: PollDefinitionReason | "invalid-selection-mode";
}

export async function createPollAction(_prev: CreatePollState, formData: FormData): Promise<CreatePollState> {
  await requireOperator();
  const selectionMode = formData.get("selectionMode");
  if (selectionMode !== "single" && selectionMode !== "multiple") {
    return { error: "invalid-selection-mode" };
  }

  // 폼의 마감 시각은 시간대 없는 "YYYY-MM-DDTHH:mm"이며 항상 KST로 해석한다.
  const closesAt = parseKstInputValue(String(formData.get("closesAt") ?? ""));
  if (!closesAt) return { error: "invalid-closing-time" };

  let id: string;
  try {
    ({ id } = await createPoll(getDb(), {
      question: String(formData.get("question") ?? ""),
      options: formData.getAll("option").map(String),
      selectionMode,
      selectionLimit: selectionMode === "multiple" ? Number(formData.get("selectionLimit")) : undefined,
      closesAt,
    }));
  } catch (err) {
    if (err instanceof PollDefinitionError) return { error: err.reason };
    throw err;
  }
  redirect(`/operator/polls/${id}`);
}

export async function closePollAction(pollId: string): Promise<void> {
  await requireOperator();
  await closePoll(getDb(), pollId);
  refresh();
}
