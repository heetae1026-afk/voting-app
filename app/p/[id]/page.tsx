import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db/neon";
import { getPoll } from "@/lib/polls/polls";
import { VoteForm } from "./vote-form";

export const metadata: Metadata = { title: "투표하기" };

export default async function PollPage(props: PageProps<"/p/[id]">) {
  const { id } = await props.params;
  const poll = await getPoll(getDb(), id);
  if (!poll) notFound();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">{poll.question}</h1>
      {poll.status === "closed" ? (
        <p role="status" className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
          마감된 투표입니다. 더 이상 투표할 수 없습니다.
        </p>
      ) : (
        <VoteForm poll={poll} />
      )}
    </main>
  );
}
