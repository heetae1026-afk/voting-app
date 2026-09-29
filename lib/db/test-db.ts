import { PGlite } from "@electric-sql/pglite";
import type { Db } from "./db";
import { readMigrations } from "./migrations";

// PGlite는 띄우는 데 수 초가 걸려, 테스트마다 새로 띄우면 병렬 실행 시 시간 초과가 난다.
// 그래서 테스트 파일마다 한 번만 띄워 마이그레이션하고, 테스트마다 모든 테이블을 비운다.
let instance: Promise<PGlite> | undefined;

async function migratedPglite(): Promise<PGlite> {
  const pg = new PGlite();
  for (const m of await readMigrations()) await pg.exec(m.sql);
  return pg;
}

/** 운영과 같은 마이그레이션을 적용한 빈 인메모리 Postgres. 테스트 전용. */
export async function createTestDb(): Promise<Db> {
  instance ??= migratedPglite();
  const pg = await instance;
  await pg.exec(`
    DO $$
    DECLARE tables text;
    BEGIN
      SELECT string_agg(quote_ident(tablename), ', ') INTO tables FROM pg_tables WHERE schemaname = 'public';
      IF tables IS NOT NULL THEN
        EXECUTE 'TRUNCATE ' || tables || ' RESTART IDENTITY CASCADE';
      END IF;
    END $$;
  `);
  return {
    async query<T>(text: string, params?: unknown[]) {
      return (await pg.query<T>(text, params)).rows;
    },
  };
}
