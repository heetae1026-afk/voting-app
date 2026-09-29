"use client";

import { useActionState, useState } from "react";
import { createPollAction, type CreatePollState } from "../actions";

const ERROR_MESSAGES: Record<NonNullable<CreatePollState["error"]>, string> = {
  "empty-question": "질문을 입력해 주세요.",
  "too-few-options": "선택지는 2개 이상이어야 합니다.",
  "empty-option": "비어 있는 선택지가 있습니다. 내용을 입력하거나 지워 주세요.",
  "duplicate-option": "같은 선택지가 두 번 들어 있습니다.",
  "invalid-selection-limit": "최대 선택 수는 2 이상, 선택지 수 이하로 정해 주세요.",
  "invalid-selection-mode": "선택 방식을 골라 주세요.",
};

interface OptionRow {
  key: number;
  label: string;
}

let nextKey = 0;
const newRow = (label = ""): OptionRow => ({ key: nextKey++, label });

export function CreatePollForm() {
  const [state, formAction, pending] = useActionState(createPollAction, {});
  // 입력값은 모두 제어 컴포넌트로 둔다. 서버 검증에 실패해도 폼이 초기화되지 않는다.
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<OptionRow[]>(() => [newRow(), newRow()]);
  const [selectionMode, setSelectionMode] = useState<"single" | "multiple">("single");
  const [selectionLimit, setSelectionLimit] = useState(2);

  const updateOption = (key: number, label: string) =>
    setOptions((rows) => rows.map((r) => (r.key === key ? { ...r, label } : r)));
  const removeOption = (key: number) => setOptions((rows) => rows.filter((r) => r.key !== key));
  const moveOption = (index: number, delta: -1 | 1) =>
    setOptions((rows) => {
      const next = [...rows];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-medium">질문</span>
        <input
          name="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          placeholder="예: 다음 MT 장소는?"
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-medium">선택지</legend>
        {options.map((row, i) => (
          <div key={row.key} className="flex items-center gap-2">
            <input
              name="option"
              value={row.label}
              onChange={(e) => updateOption(row.key, e.target.value)}
              required
              aria-label={`선택지 ${i + 1}`}
              placeholder={`선택지 ${i + 1}`}
              className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
            <button
              type="button"
              onClick={() => moveOption(i, -1)}
              disabled={i === 0}
              aria-label={`선택지 ${i + 1} 위로`}
              className="rounded px-2 py-2 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => moveOption(i, 1)}
              disabled={i === options.length - 1}
              aria-label={`선택지 ${i + 1} 아래로`}
              className="rounded px-2 py-2 disabled:opacity-30"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => removeOption(row.key)}
              disabled={options.length <= 2}
              aria-label={`선택지 ${i + 1} 삭제`}
              className="rounded px-2 py-2 text-red-600 disabled:opacity-30"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setOptions((rows) => [...rows, newRow()])}
          className="self-start rounded-lg border border-dashed border-zinc-400 px-3 py-2 text-sm"
        >
          + 선택지 추가
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 font-medium">선택 방식</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="selectionMode"
            value="single"
            checked={selectionMode === "single"}
            onChange={() => setSelectionMode("single")}
          />
          단일 선택 (하나만 고름)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="selectionMode"
            value="multiple"
            checked={selectionMode === "multiple"}
            onChange={() => setSelectionMode("multiple")}
          />
          복수 선택
        </label>
        {selectionMode === "multiple" && (
          <label className="ml-6 flex items-center gap-2">
            최대
            <input
              type="number"
              name="selectionLimit"
              min={2}
              max={options.length}
              value={selectionLimit}
              onChange={(e) => setSelectionLimit(Number(e.target.value))}
              className="w-20 rounded-lg border border-zinc-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
            />
            개까지 고를 수 있음
          </label>
        )}
      </fieldset>

      {state.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-red-700 dark:bg-red-950 dark:text-red-300">
          {ERROR_MESSAGES[state.error]}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {pending ? "만드는 중…" : "투표 만들기"}
      </button>
    </form>
  );
}
