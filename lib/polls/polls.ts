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
  options: Option[];
}

export type PollDefinitionReason =
  | "empty-question"
  | "too-few-options"
  | "empty-option"
  | "duplicate-option"
  | "invalid-selection-limit";

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

export async function createPoll(db: Db, input: NewPoll): Promise<{ id: string }> {
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

  const id = newPollId();
  // Poll과 Option을 한 문장으로 넣어 원자적으로 만든다. Neon HTTP 드라이버는 대화형 트랜잭션이 없다.
  await db.query(
    `WITH p AS (
       INSERT INTO polls (id, question, selection_mode, selection_limit)
       VALUES ($1, $2, $3, $4)
       RETURNING id
     )
     INSERT INTO options (poll_id, label, position)
     SELECT p.id, o.label, o.ord - 1
     FROM p, unnest($5::text[]) WITH ORDINALITY AS o (label, ord)`,
    [id, question, input.selectionMode, selectionLimit, options],
  );
  return { id };
}

export async function getPoll(db: Db, id: string): Promise<Poll | null> {
  const [poll] = await db.query<{
    id: string;
    question: string;
    selection_mode: SelectionMode;
    selection_limit: number;
    status: PollStatus;
  }>(
    `SELECT id, question, selection_mode, selection_limit, status FROM polls WHERE id = $1`,
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
    options,
  };
}
