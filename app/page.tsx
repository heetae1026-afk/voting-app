import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold">투표</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        동아리·학생회를 위한 간단한 투표 도구입니다. 운영자가 투표를 만들고 링크를 공유하면, 구성원이 링크에서 투표합니다.
      </p>
      <Link
        href="/operator/polls/new"
        className="self-start rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
      >
        새 투표 만들기
      </Link>
    </main>
  );
}
