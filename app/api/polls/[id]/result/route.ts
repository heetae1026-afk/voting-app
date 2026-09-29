import { getDb } from "@/lib/db/neon";
import { getResult } from "@/lib/polls/results";

/** Voter 시점의 Result. Open Poll이면 { visibility: "hidden" }을 돌려준다. */
export async function GET(_req: Request, ctx: RouteContext<"/api/polls/[id]/result">) {
  const { id } = await ctx.params;
  const view = await getResult(getDb(), id, "voter");
  if (!view) return Response.json({ error: "poll-not-found" }, { status: 404 });
  return Response.json(view, { headers: { "Cache-Control": "no-store" } });
}
