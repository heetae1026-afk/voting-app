import type { Metadata } from "next";
import { CreatePollForm } from "./create-poll-form";

export const metadata: Metadata = { title: "새 투표 만들기" };

export default function NewPollPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold">새 투표 만들기</h1>
      <CreatePollForm />
    </main>
  );
}
