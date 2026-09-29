import { PGlite } from "@electric-sql/pglite";
import type { Db } from "./db";
import { readMigrations } from "./migrations";

/** 운영과 같은 마이그레이션을 적용한 새 인메모리 Postgres. 테스트 전용. */
export async function createTestDb(): Promise<Db> {
  const pg = new PGlite();
  for (const m of await readMigrations()) await pg.exec(m.sql);
  return {
    async query<T>(text: string, params?: unknown[]) {
      return (await pg.query<T>(text, params)).rows;
    },
  };
}
