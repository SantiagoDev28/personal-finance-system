import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

import { DATABASE_POOL } from '../../../database/database.module';
import {
  readOutstanding,
  rollback,
} from '../../../card-payments/infrastructure/persistence/card-ledger';
import { cardDebt } from '../../domain/cash-resume';
import { Transaction } from '../../domain/entities/transaction.entity';
import {
  TransactionFilter,
  filterDateBounds,
} from '../../domain/repositories/transaction-filter';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionRow, mapRowToTransaction } from './transaction.mapper';

const TRANSACTION_SELECT = `
  SELECT
    t.id,
    t.amount,
    t.description,
    t.date,
    t.category,
    t.account,
    t.type
  FROM transactions t
`;

@Injectable()
export class TransactionPostgres implements TransactionRepository {
  constructor(
    @Inject(DATABASE_POOL)
    private readonly pool: Pool,
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    try {
      await this.pool.query(
        `
        INSERT INTO transactions (
          id, amount, description, date, category, account, type
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        this.bound(transaction),
      );
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          `Transaction with id ${transaction.id} already exists`,
        );
      }
      throw error;
    }
    return transaction;
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await lockLedger(client);
      const previous = await this.previousDebt(client, transaction.id);
      await this.assertNextOutstanding(
        client,
        previous.debt,
        cardDebt(transaction),
      );
      await client.query(
        `
        UPDATE transactions
        SET
          amount = $2,
          description = $3,
          date = $4,
          category = $5,
          account = $6,
          type = $7
        WHERE id = $1
        `,
        this.bound(transaction),
      );
      await client.query('COMMIT');
      return transaction;
    } catch (error) {
      await rollback(client);
      throw error;
    } finally {
      client.release();
    }
  }

  findAll(): Promise<Transaction[]> {
    return this.queryTransactions('', []);
  }

  async findById(id: string): Promise<Transaction> {
    const rows = await this.queryTransactions('WHERE t.id = $1', [id]);
    const transaction = rows[0];
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  findByFilter(filter: TransactionFilter): Promise<Transaction[]> {
    const { start, end } = filterDateBounds(filter);
    if (
      (start && Number.isNaN(start.getTime())) ||
      (end && Number.isNaN(end.getTime()))
    ) {
      return Promise.resolve([]);
    }

    const clauses: string[] = [];
    const values: unknown[] = [];
    if (filter.type) {
      values.push(filter.type);
      clauses.push(`t.type = $${values.length}`);
    }
    if (filter.category) {
      values.push(filter.category);
      clauses.push(`t.category = $${values.length}`);
    }
    if (start) {
      values.push(start);
      clauses.push(`t.date >= $${values.length}`);
    }
    if (end) {
      values.push(end);
      clauses.push(`t.date <= $${values.length}`);
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    return this.queryTransactions(where, values);
  }

  async delete(id: string): Promise<string> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await lockLedger(client);
      const previous = await this.previousDebt(client, id);
      await this.assertNextOutstanding(client, previous.debt, 0);
      const result = await client.query(
        'DELETE FROM transactions WHERE id = $1',
        [id],
      );
      if ((result.rowCount ?? 0) === 0) {
        throw new NotFoundException(`Transaction with id ${id} not found`);
      }
      await client.query('COMMIT');
      return `Successfully deleted transaction with id ${id}`;
    } catch (error) {
      await rollback(client);
      throw error;
    } finally {
      client.release();
    }
  }

  private async previousDebt(
    client: PoolClient,
    id: string,
  ): Promise<{ debt: number }> {
    const previous = await client.query<{
      amount: string;
      account: string;
      type: string;
    }>('SELECT amount, account, type FROM transactions WHERE id = $1', [id]);
    const row = previous.rows[0];
    if (!row) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return {
      debt: cardDebt({
        amount: Number(row.amount),
        account: row.account,
        type: row.type,
      }),
    };
  }

  private async assertNextOutstanding(
    client: PoolClient,
    previousDebt: number,
    nextDebt: number,
  ): Promise<void> {
    const outstanding = await readOutstanding(client);
    if (outstanding - previousDebt + nextDebt < 0) {
      throw new BadRequestException('Card outstanding would be below zero');
    }
  }

  private bound(transaction: Transaction): unknown[] {
    return [
      transaction.id,
      transaction.amount,
      transaction.description,
      transaction.date,
      transaction.category,
      transaction.account,
      transaction.type,
    ];
  }

  private async queryTransactions(
    where: string,
    values: unknown[],
  ): Promise<Transaction[]> {
    const result = await this.pool.query<TransactionRow>(
      `${TRANSACTION_SELECT} ${where} ORDER BY t.date ASC, t.id ASC`,
      values,
    );
    return result.rows.map(mapRowToTransaction);
  }
}

async function lockLedger(client: PoolClient): Promise<void> {
  await client.query('LOCK TABLE transactions IN SHARE ROW EXCLUSIVE MODE');
  await client.query('LOCK TABLE card_payments IN SHARE ROW EXCLUSIVE MODE');
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
}
