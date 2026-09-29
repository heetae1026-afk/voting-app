import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db/neon";
import { getPoll } from "@/lib/polls/polls";
import { CopyPollLink } from "./copy-poll-link";

export const metadata: Metadata = { title: "투표" };

export default async function OperatorPollPage(props: PageProps<"/operator/polls/[id]">) {
  // TODO(Operator 인증 티켓): Operator 세션을 확인한다.
  const { id } = await props.params;
  const poll = await getPoll(getDb(), id);
  if (!poll) notFound();

  // 배포 주소를 설정으로 두지 않고, 지금 요청이 들어온 주소를 기준으로 Poll link를 만든다.
  // 프록시를 여러 번 거치면 x-forwarded-* 값이 쉼표로 이어지므로 첫 값(클라이언트 쪽)만 쓴다.
  // x-forwarded-proto가 없으면 프록시 없이 직접 연결된 것이므로 http다.
  const h = await headers();
  const first = (name: string) => h.get(name)?.split(",")[0].trim();
  const host = first("x-forwarded-host") ?? h.get("host");
  const proto = first("x-forwarded-proto") ?? "http";
  const pollUrl = `${proto}://${host}/p/${poll.id}`;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-zinc-500">투표가 만들어졌습니다</p>
        <h1 className="text-2xl font-semibold">{poll.question}</h1>
        <p className="text-sm text-zinc-500">
          {poll.selectionMode === "single" ? "단일 선택" : `복수 선택 · 최대 ${poll.selectionLimit}개`}
        </p>
      </div>

      <ol className="flex list-decimal flex-col gap-1 pl-6">
        {poll.options.map((o) => (
          <li key={o.id}>{o.label}</li>
        ))}
      </ol>

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">투표 링크</h2>
        <p className="text-sm text-zinc-500">이 링크를 조직 구성원에게 공유하세요.</p>
        <CopyPollLink url={pollUrl} />
      </section>

      <Link href="/operator/polls/new" className="text-sm underline">
        다른 투표 만들기
      </Link>
    </main>
  );
}
