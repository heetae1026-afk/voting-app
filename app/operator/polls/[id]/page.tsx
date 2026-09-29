import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ResultTable } from "@/app/ui/result-table";
import { requireOperator } from "@/lib/auth/operator";
import { getDb } from "@/lib/db/neon";
import { getPoll } from "@/lib/polls/polls";
import { getResult } from "@/lib/polls/results";
import { CopyPollLink } from "./copy-poll-link";
import { ClosePollButton, RefreshButton } from "./poll-controls";

export const metadata: Metadata = { title: "투표 관리" };

export default async function OperatorPollPage(props: PageProps<"/operator/polls/[id]">) {
  const { id } = await props.params;
  await requireOperator(`/operator/polls/${id}`);
  const db = getDb();
  const poll = await getPoll(db, id);
  if (!poll) notFound();
  const view = await getResult(db, id, "operator");

  // 프록시를 여러 번 거치면 x-forwarded-* 값이 쉼표로 이어지므로 첫 값(클라이언트 쪽)만 쓴다.
  // x-forwarded-proto가 없으면 프록시 없이 직접 연결된 것이므로 http다.
  const h = await headers();
  const first = (name: string) => h.get(name)?.split(",")[0].trim();
  const host = first("x-forwarded-host") ?? h.get("host");
  const proto = first("x-forwarded-proto") ?? "http";
  const pollUrl = `${proto}://${host}/p/${poll.id}`;

  const isOpen = poll.status === "open";

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isOpen ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {isOpen ? "진행 중" : "마감"}
          </span>
        </p>
        <h1 className="text-2xl font-semibold">{poll.question}</h1>
        <p className="text-sm text-zinc-500">
          {poll.selectionMode === "single" ? "단일 선택" : `복수 선택 · 최대 ${poll.selectionLimit}개`}
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">투표 링크</h2>
        <p className="text-sm text-zinc-500">이 링크를 조직 구성원에게 공유하세요.</p>
        <CopyPollLink url={pollUrl} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">결과</h2>
          <RefreshButton />
        </div>
        {isOpen && <p className="text-sm text-zinc-500">운영자만 볼 수 있습니다. 구성원에게는 마감 후 공개됩니다.</p>}
        {view?.visibility === "visible" && <ResultTable result={view.result} selectionMode={poll.selectionMode} />}
      </section>

      {isOpen && <ClosePollButton pollId={poll.id} />}

      <Link href="/operator/polls/new" className="text-sm underline">
        다른 투표 만들기
      </Link>
    </main>
  );
}
