import type { Metadata } from "next";
import { requireOperator } from "@/lib/auth/operator";
import { closingTimeInputRange } from "@/lib/time/kst";
import { CreatePollForm } from "./create-poll-form";

export const metadata: Metadata = { title: "새 투표 만들기" };

// 요청 시점 기준의 입력 범위. 컴포넌트 밖에서 현재 시각을 읽는다.
const currentClosingTimeRange = () => closingTimeInputRange(new Date());

export default async function NewPollPage() {
  await requireOperator("/operator/polls/new");

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-semibold">새 투표 만들기</h1>
      <CreatePollForm closingTime={currentClosingTimeRange()} />
    </main>
  );
}
