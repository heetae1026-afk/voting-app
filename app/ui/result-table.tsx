import type { Result } from "@/lib/polls/results";
import type { SelectionMode } from "@/lib/polls/polls";

const percent = (ratio: number) => `${Math.round(ratio * 1000) / 10}%`;

/** Option 순서대로 선택 수, 비율, 막대를 보여준다. */
export function ResultTable({ result, selectionMode }: { result: Result; selectionMode: SelectionMode }) {
  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm text-zinc-500">전체 {result.totalVotes}표</p>
      <ul className="flex flex-col gap-3">
        {result.options.map((o) => (
          <li key={o.id} className="flex flex-col gap-1">
            <div className="flex justify-between gap-4">
              <span className="font-medium">{o.label}</span>
              <span className="shrink-0 tabular-nums text-zinc-600 dark:text-zinc-400">
                {o.count}표 · {percent(o.ratio)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100" style={{ width: percent(o.ratio) }} />
            </div>
          </li>
        ))}
      </ul>
      {selectionMode === "multiple" && (
        <p className="text-xs text-zinc-500">
          복수 선택 투표라, 비율은 전체 투표 수 대비 각 선택지를 고른 비율입니다. 합이 100%를 넘을 수 있습니다.
        </p>
      )}
    </section>
  );
}
