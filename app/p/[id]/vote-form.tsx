"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import type { Poll } from "@/lib/polls/polls";
import { castVoteAction, type CastVoteState } from "./actions";

const ERROR_MESSAGES: Record<NonNullable<CastVoteState["error"]>, string> = {
  "poll-not-found": "이 투표를 찾을 수 없습니다.",
  "poll-closed": "투표가 마감되어 제출할 수 없습니다.",
  "no-selection": "선택지를 하나 이상 골라 주세요.",
  "too-many-selections": "고를 수 있는 개수를 넘었습니다.",
  "unknown-option": "이 투표에 없는 선택지입니다. 새로고침한 뒤 다시 시도해 주세요.",
  "duplicate-selection": "같은 선택지를 두 번 고를 수 없습니다.",
};

// "이 브라우저에서 Vote함" 표시. 실수로 두 번 제출하는 것을 막는 UX일 뿐, 서버는 확인하지 않는다(ADR-0001).
const votedKey = (pollId: string) => `voted:${pollId}`;

function markVoted(pollId: string) {
  try {
    localStorage.setItem(votedKey(pollId), "1");
  } catch {
    // 저장소를 쓸 수 없는 브라우저(시크릿 모드 등)에서는 표시 없이 넘어간다.
  }
}

function hasVoted(pollId: string) {
  try {
    return localStorage.getItem(votedKey(pollId)) !== null;
  } catch {
    return false;
  }
}

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function VoteForm({ poll }: { poll: Poll }) {
  const alreadyVoted = useSyncExternalStore(subscribeToStorage, () => hasVoted(poll.id), () => false);
  const [selected, setSelected] = useState<string[]>([]);
  const [step, setStep] = useState<"choose" | "confirm">("choose");
  const [state, formAction, pending] = useActionState(async (prev: CastVoteState, formData: FormData) => {
    const next = await castVoteAction(poll.id, prev, formData);
    if (next.voted) markVoted(poll.id);
    return next;
  }, {});

  const isSingle = poll.selectionMode === "single";
  const labelOf = (id: string) => poll.options.find((o) => o.id === id)?.label;
  const selectedLabels = poll.options.filter((o) => selected.includes(o.id)).map((o) => o.label);

  if (state.voted) {
    return (
      <section role="status" className="flex flex-col gap-2 rounded-lg bg-green-50 p-4 dark:bg-green-950">
        <p className="font-medium">투표했습니다.</p>
        <p className="text-sm">고른 선택지: {selectedLabels.join(", ")}</p>
      </section>
    );
  }

  if (alreadyVoted) {
    return (
      <p role="status" className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
        이 브라우저에서는 이미 투표했습니다.
      </p>
    );
  }

  function toggle(id: string) {
    if (isSingle) return setSelected([id]);
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  if (step === "confirm") {
    return (
      <form action={formAction} className="flex flex-col gap-4">
        <p className="font-medium">아래 선택지로 투표합니다. 제출한 뒤에는 바꿀 수 없습니다.</p>
        <ul className="flex list-disc flex-col gap-1 pl-6">
          {selected.map((id) => (
            <li key={id}>
              {labelOf(id)}
              <input type="hidden" name="option" value={id} />
            </li>
          ))}
        </ul>
        {state.error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-red-700 dark:bg-red-950 dark:text-red-300">
            {ERROR_MESSAGES[state.error]}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep("choose")}
            disabled={pending}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 dark:border-zinc-700"
          >
            다시 고르기
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {pending ? "제출 중…" : "제출"}
          </button>
        </div>
      </form>
    );
  }

  const limitReached = !isSingle && selected.length >= poll.selectionLimit;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500">
        {isSingle ? "하나만 고를 수 있습니다." : `최대 ${poll.selectionLimit}개까지 고를 수 있습니다.`}
      </p>
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">선택지</legend>
        {poll.options.map((o) => {
          const checked = selected.includes(o.id);
          return (
            <label
              key={o.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-300 px-4 py-3 has-[:checked]:border-zinc-900 has-[:disabled]:opacity-50 dark:border-zinc-700 dark:has-[:checked]:border-zinc-100"
            >
              <input
                type={isSingle ? "radio" : "checkbox"}
                name="choice"
                checked={checked}
                disabled={!checked && limitReached}
                onChange={() => toggle(o.id)}
              />
              {o.label}
            </label>
          );
        })}
      </fieldset>
      <button
        type="button"
        onClick={() => setStep("confirm")}
        disabled={selected.length === 0}
        className="rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        투표하기
      </button>
    </div>
  );
}
