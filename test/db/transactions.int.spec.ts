import 'dotenv/config';
import { Pool } from 'pg';

import { readDatabaseConfig } from '../../src/database/database-config';
import { TransactionService } from '../../src/transactions/application/transaction.service';
import {
  TransactionCategory,
  TransactionMethod,
  TransactionType,
} from '../../src/transactions/domain/enums/transaction.enum';
import { TransactionPostgres } from '../../src/transactions/infrastructure/persistence/transaction.postgres';
import {
  emptyTransactions,
  openTestDatabase,
  TEST_DATABASE_NAME,
} from './prepare-database';

describe('transactions persisted in PostgreSQL', () => {
  let pool: Pool;
  let service: TransactionService;
  let daily: Pool;
  let dailyCount = 0;

  beforeAll(async () => {
    pool = await openTestDatabase();
    service = new TransactionService(new TransactionPostgres(pool));
    daily = new Pool({
      ...readDatabaseConfig(process.env),
      connectionTimeoutMillis: 3000,
    });
    const count = await daily.query<{ n: number }>(
      'SELECT count(*)::int AS n FROM transactions',
    );
    dailyCount = Number(count.rows[0]?.n ?? 0);
  });

  beforeEach(async () => {
    await emptyTransactions(pool);
  });

  afterAll(async () => {
    try {
      if (daily) {
        const count = await daily.query<{ n: number }>(
          'SELECT count(*)::int AS n FROM transactions',
        );
        expect(Number(count.rows[0]?.n ?? 0)).toBe(dailyCount);
      }
    } finally {
      await daily?.end();
      await pool?.end();
    }
  });

  it('creates, reads and rejects a repeated id', async () => {
    const created = await service.create(
      movement('mov-1', 100000, TransactionType.INCOME),
    );

    expect(await service.findById('mov-1')).toEqual(created);
    await expect(
      service.create(movement('mov-1', 1000, TransactionType.EXPENSE)),
    ).rejects.toThrow('Transaction with id mov-1 already exists');
    expect(await service.findAll({})).toHaveLength(1);
    const current = await pool.query<{ name: string }>(
      'SELECT current_database() AS name',
    );
    expect(current.rows[0]?.name).toBe(TEST_DATABASE_NAME);
  });

  it('lists by date and then by id', async () => {
    const day = new Date('2026-09-02T00:00:00.000Z');
    await service.create(movement('b', 100, TransactionType.EXPENSE, day));
    await service.create(
      movement('later', 300, TransactionType.EXPENSE, new Date('2026-09-03')),
    );
    await service.create(movement('a', 200, TransactionType.INCOME, day));

    expect(
      (await service.findAll({})).map((transaction) => transaction.id),
    ).toEqual(['a', 'b', 'later']);
  });

  it('updates a row and keeps the previous row when the edit is invalid', async () => {
    await service.create(
      movement(
        'mov-9',
        18000,
        TransactionType.EXPENSE,
        undefined,
        TransactionCategory.FOOD,
      ),
    );

    const updated = await service.update('mov-9', { amount: 22000 });
    expect(updated.amount).toBe(22000);
    expect(await service.resume()).toEqual({
      income: 0,
      expense: 22000,
      balance: -22000,
    });

    await expect(
      service.update('mov-9', {
        amount: 0,
        description: 'Cena',
        category: TransactionCategory.ENTERTAINMENT,
      }),
    ).rejects.toThrow('Amount must be greater than 0');

    const stored = await pool.query<{ amount: string; description: string }>(
      'SELECT amount, description FROM transactions WHERE id = $1',
      ['mov-9'],
    );
    expect(Number(stored.rows[0]?.amount)).toBe(22000);
    expect(stored.rows[0]?.description).toBe('mov-9');
    expect(await service.resume()).toEqual(
      calculateResume(await service.findAll({})),
    );
  });

  it('deletes a row and the balance matches the rows that remain', async () => {
    await service.create(movement('mov-10', 100000, TransactionType.INCOME));
    await service.create(movement('mov-11', 18000, TransactionType.EXPENSE));

    expect(await service.delete('mov-11')).toEqual({
      message: 'Transaction with id mov-11 deleted successfully',
    });
    await expect(service.findById('mov-11')).rejects.toThrow(
      'Transaction with id mov-11 not found',
    );

    const remaining = await service.findAll({});
    expect(remaining.map((transaction) => transaction.id)).toEqual(['mov-10']);
    expect(await service.resume()).toEqual({
      income: 100000,
      expense: 0,
      balance: 100000,
    });
    expect(await service.resume()).toEqual(calculateResume(remaining));
  });

  it('filters the list and the balance with the same date rule', async () => {
    await service.create(
      movement(
        'before',
        1000,
        TransactionType.EXPENSE,
        new Date('2026-09-30T23:59:59.999Z'),
        TransactionCategory.FOOD,
      ),
    );
    await service.create(
      movement(
        'start',
        10000,
        TransactionType.INCOME,
        new Date('2026-10-01T00:00:00.000Z'),
      ),
    );
    await service.create(
      movement(
        'middle',
        4000,
        TransactionType.EXPENSE,
        new Date('2026-10-02T15:00:00.000Z'),
        TransactionCategory.FOOD,
      ),
    );
    await service.create(
      movement(
        'after',
        5000,
        TransactionType.EXPENSE,
        new Date('2026-10-04T00:00:00.000Z'),
        TransactionCategory.FOOD,
      ),
    );

    const filter = {
      type: TransactionType.EXPENSE,
      category: TransactionCategory.FOOD,
      startDate: '2026-10-01',
      endDate: '2026-10-03',
    };
    const listed = await service.findAll(filter);

    expect(listed.map((transaction) => transaction.id)).toEqual(['middle']);
    expect(await service.resume(filter)).toEqual({
      income: 0,
      expense: 4000,
      balance: -4000,
    });
    expect(await service.resume(filter)).toEqual(calculateResume(listed));
    expect(await service.resume()).toEqual(
      calculateResume(await service.findAll({})),
    );
  });

  it('keeps the movement when another connection reads it', async () => {
    const created = await service.create(
      movement('mov-restart', 45000, TransactionType.INCOME),
    );
    const restartedPool = new Pool({
      ...readDatabaseConfig(process.env),
      database: TEST_DATABASE_NAME,
    });

    try {
      const restarted = new TransactionService(
        new TransactionPostgres(restartedPool),
      );
      expect(await restarted.findById('mov-restart')).toEqual(created);
      expect(await restarted.resume()).toEqual({
        income: 45000,
        expense: 0,
        balance: 45000,
      });
    } finally {
      await restartedPool.end();
    }
  });
});

function movement(
  id: string,
  amount: number,
  type: TransactionType,
  date: Date = new Date('2026-09-02T00:00:00.000Z'),
  category: TransactionCategory = TransactionCategory.OTHER,
) {
  return {
    id,
    amount,
    description: id,
    category,
    method:
      type === TransactionType.INCOME
        ? TransactionMethod.TRANSFER
        : TransactionMethod.CASH,
    type,
    date,
  };
}

function calculateResume(
  transactions: { type: TransactionType; amount: number }[],
) {
  const income = transactions
    .filter((transaction) => transaction.type === TransactionType.INCOME)
    .reduce((total, transaction) => total + transaction.amount, 0);
  const expense = transactions
    .filter((transaction) => transaction.type === TransactionType.EXPENSE)
    .reduce((total, transaction) => total + transaction.amount, 0);
  return { income, expense, balance: income - expense };
}
