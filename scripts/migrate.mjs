// migrations 폴더의 아직 적용하지 않은 SQL 파일을 DATABASE_URL의 DB에 이름순으로 적용한다.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const dir = path.join(process.cwd(), "migrations");
const pool = new Pool({ connectionString: url });
const client = await pool.connect();

try {
  await client.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
  );
  const applied = new Set((await client.query("SELECT name FROM schema_migrations")).rows.map((r) => r.name));
  const names = (await readdir(dir)).filter((n) => n.endsWith(".sql")).sort();

  for (const name of names) {
    if (applied.has(name)) continue;
    const sql = await readFile(path.join(dir, name), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
      await client.query("COMMIT");
      console.log(`applied ${name}`);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  }
  console.log("migrations up to date");
} finally {
  client.release();
  await pool.end();
}
