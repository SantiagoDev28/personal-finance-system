import { Pool } from 'pg';

import { applyMigrations } from '../../src/database/apply-migrations';
import { readDatabaseConfig } from '../../src/database/database-config';

export const TEST_DATABASE_NAME = 'personal_finance_test';

export async function openTestDatabase(): Promise<Pool> {
  const config = readDatabaseConfig(process.env);
  if (config.database === TEST_DATABASE_NAME) {
    throw new Error(
      'DATABASE_NAME apunta a la base de prueba. Déjala en la base de uso diario; pnpm test:db crea personal_finance_test aparte.',
    );
  }

  const admin = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres',
    connectionTimeoutMillis: 3000,
  });

  try {
    const existing = await admin.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [TEST_DATABASE_NAME],
    );
    if ((existing.rowCount ?? 0) === 0) {
      await admin.query(`CREATE DATABASE ${TEST_DATABASE_NAME}`);
    }
  } finally {
    await admin.end();
  }

  const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: TEST_DATABASE_NAME,
    connectionTimeoutMillis: 3000,
  });

  await pool.query('DROP SCHEMA public CASCADE');
  await pool.query('CREATE SCHEMA public');
  await applyMigrations(pool);

  const current = await pool.query<{ name: string }>(
    'SELECT current_database() AS name',
  );
  if (current.rows[0]?.name !== TEST_DATABASE_NAME) {
    await pool.end();
    throw new Error(
      `La prueba quedó en ${current.rows[0]?.name ?? 'otra base'}, no en ${TEST_DATABASE_NAME}.`,
    );
  }

  return pool;
}

export async function emptyTransactions(pool: Pool): Promise<void> {
  await pool.query('TRUNCATE transactions');
}
