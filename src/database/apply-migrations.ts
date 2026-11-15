import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool, PoolClient } from 'pg';

const MIGRATIONS_DIR = join(__dirname, 'migrations');

export async function applyMigrations(pool: Pool): Promise<string[]> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const applied = await pool.query<{ id: string }>(
    'SELECT id FROM schema_migrations',
  );
  const done = new Set(applied.rows.map((row) => row.id));
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  const ran: string[] = [];
  for (const file of files) {
    if (done.has(file)) {
      continue;
    }
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [
        file,
      ]);
      await client.query('COMMIT');
      ran.push(file);
    } catch (error) {
      await rollback(client);
      throw error;
    } finally {
      client.release();
    }
  }
  return ran;
}

async function rollback(client: PoolClient): Promise<void> {
  try {
    await client.query('ROLLBACK');
  } catch {
    // The connection already aborted the transaction.
  }
}
