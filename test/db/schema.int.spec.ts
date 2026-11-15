import 'dotenv/config';
import { Pool } from 'pg';

import { applyMigrations } from '../../src/database/apply-migrations';
import { readDatabaseConfig } from '../../src/database/database-config';

const EMPTY_DATABASE = 'personal_finance_empty';

describe('transaction schema migrations', () => {
  let admin: Pool;
  let pool: Pool;

  beforeAll(async () => {
    const config = readDatabaseConfig(process.env);
    if (config.database === EMPTY_DATABASE) {
      throw new Error(
        'DATABASE_NAME no puede ser la base vacía de las migraciones.',
      );
    }
    admin = new Pool({
      ...config,
      database: 'postgres',
      connectionTimeoutMillis: 3000,
    });
    pool = await recreate();
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE transactions');
  });

  afterAll(async () => {
    await pool?.end();
    if (admin) {
      await dropDatabase(admin);
      await admin.end();
    }
  });

  it('creates the movement table and can rebuild an empty database', async () => {
    expect(await columns(pool)).toEqual([
      'id',
      'amount',
      'description',
      'category',
      'account',
      'type',
      'date',
    ]);
    expect(await columns(pool)).not.toContain('page_id');

    const index = await pool.query<{ indexdef: string }>(
      `SELECT indexdef FROM pg_indexes WHERE tablename = 'transactions' AND indexname = 'transactions_date_idx'`,
    );
    expect(index.rows[0]?.indexdef).toContain('(date)');

    await pool.end();
    pool = await recreate();
    expect(await columns(pool)).toEqual([
      'id',
      'amount',
      'description',
      'category',
      'account',
      'type',
      'date',
    ]);
    expect(await applyMigrations(pool)).toEqual([]);
    const current = await pool.query<{ name: string }>(
      'SELECT current_database() AS name',
    );
    expect(current.rows[0]?.name).toBe(EMPTY_DATABASE);
  });

  it('rejects a zero, negative or fractional amount', async () => {
    await expect(insert(pool, { amount: 0 })).rejects.toMatchObject({
      code: '23514',
    });
    await expect(insert(pool, { amount: -18000 })).rejects.toMatchObject({
      code: '23514',
    });
    await expect(insert(pool, { amount: 1.5 })).rejects.toMatchObject({
      code: '22P02',
    });
    const stored = await pool.query<{ n: number }>(
      'SELECT count(*)::int AS n FROM transactions',
    );
    expect(Number(stored.rows[0]?.n)).toBe(0);
  });

  it('rejects a type other than income or expense and a repeated id', async () => {
    await expect(insert(pool, { type: 'transfer' })).rejects.toMatchObject({
      code: '23514',
    });

    await insert(pool, { id: 'mov-1' });
    await expect(insert(pool, { id: 'mov-1' })).rejects.toMatchObject({
      code: '23505',
    });

    const stored = await pool.query<{
      id: string;
      amount: string;
      type: string;
    }>('SELECT id, amount, type FROM transactions');
    expect(stored.rows).toEqual([
      { id: 'mov-1', amount: '18000', type: 'income' },
    ]);
  });
});

async function recreate(): Promise<Pool> {
  const config = readDatabaseConfig(process.env);
  const admin = new Pool({
    ...config,
    database: 'postgres',
    connectionTimeoutMillis: 3000,
  });
  try {
    await dropDatabase(admin);
    await admin.query(`CREATE DATABASE ${EMPTY_DATABASE}`);
  } finally {
    await admin.end();
  }

  const pool = new Pool({
    ...config,
    database: EMPTY_DATABASE,
    connectionTimeoutMillis: 3000,
  });
  await applyMigrations(pool);
  return pool;
}

async function dropDatabase(admin: Pool): Promise<void> {
  await admin.query(
    `SELECT pg_terminate_backend(pid)
     FROM pg_stat_activity
     WHERE datname = $1 AND pid <> pg_backend_pid()`,
    [EMPTY_DATABASE],
  );
  await admin.query(`DROP DATABASE IF EXISTS ${EMPTY_DATABASE}`);
}

async function columns(pool: Pool): Promise<string[]> {
  const result = await pool.query<{ column_name: string }>(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'transactions'
     ORDER BY ordinal_position`,
  );
  return result.rows.map((row) => row.column_name);
}

function insert(
  pool: Pool,
  overrides: { id?: string; amount?: number; type?: string } = {},
): Promise<unknown> {
  return pool.query(
    `INSERT INTO transactions (id, amount, description, category, account, type, date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      overrides.id ?? 'mov-amount',
      overrides.amount ?? 18000,
      'Almuerzo',
      'food',
      'cash',
      overrides.type ?? 'income',
      new Date('2026-09-02T00:00:00.000Z'),
    ],
  );
}
