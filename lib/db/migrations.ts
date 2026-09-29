import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const MIGRATIONS_DIR = path.join(process.cwd(), "migrations");

/** migrations 폴더의 SQL 파일을 이름순으로 돌려준다. */
export async function readMigrations(): Promise<{ name: string; sql: string }[]> {
  const names = (await readdir(MIGRATIONS_DIR)).filter((n) => n.endsWith(".sql")).sort();
  return Promise.all(
    names.map(async (name) => ({ name, sql: await readFile(path.join(MIGRATIONS_DIR, name), "utf8") })),
  );
}
