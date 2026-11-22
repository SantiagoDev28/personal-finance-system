import 'dotenv/config';
import { Pool } from 'pg';

import { readDatabaseConfig } from '../../src/database/database-config';
import { CardPaymentService } from '../../src/card-payments/application/card-payment.service';
import { CardPayment } from '../../src/card-payments/domain/entities/card-payment.entity';
import { CardPaymentPostgres } from '../../src/card-payments/infrastructure/persistence/card-payment.postgres';
import { TransactionService } from '../../src/transactions/application/transaction.service';
import {
  Account,
  TransactionCategory,
  TransactionType,
} from '../../src/transactions/domain/enums/transaction.enum';
import { TransactionPostgres } from '../../src/transactions/infrastructure/persistence/transaction.postgres';
import { emptyTransactions, openTestDatabase } from './prepare-database';

describe('card payments persisted in PostgreSQL', () => {
  let pool: Pool;
  let transactions: TransactionService;
  let payments: CardPaymentService;
  let repository: CardPaymentPostgres;
  let daily: Pool;
  let dailyMovements = 0;
  let dailyPayments = 0;

  beforeAll(async () => {
    pool = await openTestDatabase();
    const transactionRepository = new TransactionPostgres(pool);
    repository = new CardPaymentPostgres(pool);
    transactions = new TransactionService(transactionRepository, repository);
    payments = new CardPaymentService(repository, transactionRepository);
    daily = new Pool({
      ...readDatabaseConfig(process.env),
      connectionTimeoutMillis: 3000,
    });
    dailyMovements = await count(daily, 'transactions');
    dailyPayments = await count(daily, 'card_payments');
  });

  beforeEach(async () => {
    await emptyTransactions(pool);
  });

  afterAll(async () => {
    try {
      if (daily) {
        expect(await count(daily, 'transactions')).toBe(dailyMovements);
        expect(await count(daily, 'card_payments')).toBe(dailyPayments);
      }
    } finally {
      await daily?.end();
      await pool?.end();
    }
  });

  it('rejects an abono above the outstanding balance and stores nothing', async () => {
    await transactions.create({
      id: 'market',
      amount: 100000,
      description: 'Mercado',
      category: TransactionCategory.FOOD,
      account: Account.TARJETA_CREDITO,
      type: TransactionType.EXPENSE,
      date: new Date('2026-11-03T00:00:00.000Z'),
    });

    await expect(
      payments.create({
        id: 'pay-too-much',
        amount: 100001,
        sourceAccount: Account.NU,
        date: new Date('2026-12-05T00:00:00.000Z'),
      }),
    ).rejects.toThrow('Card payment exceeds the outstanding balance');

    const over = CardPayment.create({
      id: 'pay-direct',
      amount: 100001,
      sourceAccount: Account.NU,
      description: 'Abono tarjeta',
      date: new Date('2026-12-05T00:00:00.000Z'),
    });
    await expect(repository.save(over)).rejects.toThrow(
      'Card payment exceeds the outstanding balance',
    );
    expect(await payments.findAll({})).toEqual([]);
    expect(await count(pool, 'card_payments')).toBe(0);
  });
});

function count(pool: Pool, table: 'transactions' | 'card_payments') {
  return pool
    .query<{ n: number }>(`SELECT count(*)::int AS n FROM ${table}`)
    .then((result) => Number(result.rows[0]?.n ?? 0));
}
