import { config as loadEnv } from 'dotenv';
import { Pool } from 'pg';

import { applyMigrations } from './apply-migrations';
import { readDatabaseConfig } from './database-config';

loadEnv();

async function main(): Promise<void> {
  const config = readDatabaseConfig(process.env);
  const pool = new Pool({
    ...config,
    connectionTimeoutMillis: 3000,
  });
  try {
    const applied = await applyMigrations(pool);
    const message =
      applied.length > 0
        ? `Migraciones aplicadas en ${config.database}: ${applied.join(', ')}.`
        : `La base ${config.database} ya estaba al día.`;
    process.stdout.write(`${message}\n`);
  } finally {
    await pool.end();
  }
}

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
