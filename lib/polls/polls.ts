import { randomBytes } from "node:crypto";
import type { Db } from "@/lib/db/db";

export type SelectionMode = "single" | "multiple";
export type PollStatus = "open" | "closed";

export interface NewPoll {
  question: string;
  options: string[];
  selectionMode: SelectionMode;
  /** Multiple일 때만 쓴다. Single이면 무시하고 1로 고정한다. */
  selectionLimit?: number;
  closesAt: Date;
}

export interface Option {
  id: string;
  label: string;
}

export interface Poll {
  id: string;
  question: string;
  selectionMode: SelectionMode;
  selectionLimit: number;
  status: PollStatus;
  closesAt: Date;
  options: Option[];
}

const MINUTE = 60 * 1000;
/** Closing time은 만드는 시점부터 이 범위 안이어야 한다. */
export const CLOSING_TIME_MIN_LEAD_MS = 10 * MINUTE;
export const CLOSING_TIME_MAX_LEAD_MS = 30 * 24 * 60 * MINUTE;

export type PollDefinitionReason =
  | "empty-question"
  | "too-few-options"
  | "empty-option"
  | "duplicate-option"
  | "invalid-selection-limit"
  | "invalid-closing-time";

/** Poll 정의가 규칙에 맞지 않아 만들 수 없을 때 던진다. */
export class PollDefinitionError extends Error {
  override name = "PollDefinitionError";
  constructor(readonly reason: PollDefinitionReason) {
    super(`Invalid poll definition: ${reason}`);
  }
}

/** 추측할 수 없는 Poll ID. Poll link에 그대로 쓰인다. */
function newPollId(): string {
  return randomBytes(16).toString("base64url");
}

export async function createPoll(
  db: Db,
  input: NewPoll,
  /** now는 테스트에서 과거·미래 시점을 재현하려고 주입한다. 기본은 현재 시각. */
  { now = new Date() }: { now?: Date } = {},
): Promise<{ id: string }> {
  const question = input.question.trim();
  if (question === "") throw new PollDefinitionError("empty-question");

  const options = input.options.map((o) => o.trim());
  if (options.some((o) => o === "")) throw new PollDefinitionError("empty-option");
  if (options.length < 2) throw new PollDefinitionError("too-few-options");
  if (new Set(options).size !== options.length) throw new PollDefinitionError("duplicate-option");

  const selectionLimit = input.selectionMode === "single" ? 1 : input.selectionLimit;
  if (
    selectionLimit === undefined ||
    !Number.isInteger(selectionLimit) ||
    (input.selectionMode === "multiple" && (selectionLimit < 2 || selectionLimit > options.length))
  ) {
    throw new PollDefinitionError("invalid-selection-limit");
  }

  const lead = input.closesAt.getTime() - now.getTime();
  if (!(lead >= CLOSING_TIME_MIN_LEAD_MS && lead <= CLOSING_TIME_MAX_LEAD_MS)) {
    throw new PollDefinitionError("invalid-closing-time");
  }

  const id = newPollId();
  // Poll과 Option을 한 문장으로 넣어 원자적으로 만든다. Neon HTTP 드라이버는 대화형 트랜잭션이 없다.
  await db.query(
    `WITH p AS (
       INSERT INTO polls (id, question, selection_mode, selection_limit, closes_at)
       VALUES ($1, $2, $3, $4, $6)
       RETURNING id
     )
     INSERT INTO options (poll_id, label, position)
     SELECT p.id, o.label, o.ord - 1
     FROM p, unnest($5::text[]) WITH ORDINALITY AS o (label, ord)`,
    [id, question, input.selectionMode, selectionLimit, options, input.closesAt],
  );
  return { id };
}

/**
 * Open Poll을 지금 마감한다. 이미 Closed면(Closing time이 지난 경우 포함) 아무것도 바꾸지 않는다.
 * 다시 열거나 Closing time을 늦추는 기능은 없다.
 */
export async function closePoll(db: Db, id: string): Promise<void> {
  await db.query(
    `UPDATE polls SET status = 'closed', closed_at = now() WHERE id = $1 AND status = 'open' AND closes_at > now()`,
    [id],
  );
}

export async function getPoll(db: Db, id: string): Promise<Poll | null> {
  const [poll] = await db.query<{
    id: string;
    question: string;
    selection_mode: SelectionMode;
    selection_limit: number;
    status: PollStatus;
    closes_at: Date | string;
  }>(
    // ADR-0002: status 칸은 "Operator가 지금 마감했는지"만 뜻한다. Closing time이 지났으면 Closed다(DB 시각 기준).
    `SELECT id, question, selection_mode, selection_limit, closes_at,
            CASE WHEN status = 'closed' OR closes_at <= now() THEN 'closed' ELSE 'open' END AS status
     FROM polls WHERE id = $1`,
    [id],
  );
  if (!poll) return null;

  const options = await db.query<{ id: string; label: string }>(
    `SELECT id::text AS id, label FROM options WHERE poll_id = $1 ORDER BY position`,
    [id],
  );

  return {
    id: poll.id,
    question: poll.question,
    selectionMode: poll.selection_mode,
    selectionLimit: poll.selection_limit,
    status: poll.status,
    // 드라이버에 따라 Date 또는 문자열로 온다.
    closesAt: new Date(poll.closes_at),
    options,
  };
}
