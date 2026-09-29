import { neon } from "@neondatabase/serverless";
import type { Db } from "./db";

let db: Db | undefined;

/** 운영 DB(Neon). DATABASE_URL 환경변수가 필요하다. 서버에서만 쓴다. */
export function getDb(): Db {
  if (!db) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    const sql = neon(url);
    db = {
      query: <T,>(text: string, params?: unknown[]) => sql.query(text, params) as Promise<T[]>,
    };
  }
  return db;
}
