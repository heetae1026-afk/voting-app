"use client";

import { useRouter } from "next/navigation";
import { closePollAction } from "../actions";

export function ClosePollButton({ pollId }: { pollId: string }) {
  return (
    <form
      action={closePollAction.bind(null, pollId)}
      onSubmit={(e) => {
        if (!confirm("투표를 마감할까요? 마감하면 다시 열 수 없고, 구성원에게 결과가 공개됩니다.")) e.preventDefault();
      }}
    >
      <button type="submit" className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 dark:border-red-800 dark:text-red-300">
        투표 마감
      </button>
    </form>
  );
}

export function RefreshButton() {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.refresh()} className="text-sm underline">
      새로고침
    </button>
  );
}
