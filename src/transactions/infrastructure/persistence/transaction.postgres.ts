import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';

import { DATABASE_POOL } from '../../../database/database.module';
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
    c.code AS category,
    m.code AS method,
    ty.code AS type
  FROM transactions t
  INNER JOIN transaction_categories c
    ON t.category_id = c.id
  INNER JOIN transaction_methods m
    ON t.method_id = m.id
  INNER JOIN transaction_types ty
    ON t.type_id = ty.id
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
          id, amount, description, date, category_id, method_id, type_id
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          (SELECT id FROM transaction_categories WHERE code = $5),
          (SELECT id FROM transaction_methods WHERE code = $6),
          (SELECT id FROM transaction_types WHERE code = $7)
        )
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
    const result = await this.pool.query(
      `
      UPDATE transactions
      SET
        amount = $2,
        description = $3,
        date = $4,
        category_id = (SELECT id FROM transaction_categories WHERE code = $5),
        method_id = (SELECT id FROM transaction_methods WHERE code = $6),
        type_id = (SELECT id FROM transaction_types WHERE code = $7)
      WHERE id = $1
      `,
      this.bound(transaction),
    );
    if ((result.rowCount ?? 0) === 0) {
      throw new NotFoundException(
        `Transaction with id ${transaction.id} not found`,
      );
    }
    return transaction;
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
      clauses.push(`ty.code = $${values.length}`);
    }
    if (filter.category) {
      values.push(filter.category);
      clauses.push(`c.code = $${values.length}`);
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
    const result = await this.pool.query(
      'DELETE FROM transactions WHERE id = $1',
      [id],
    );
    if ((result.rowCount ?? 0) === 0) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return `Successfully deleted transaction with id ${id}`;
  }

  private bound(transaction: Transaction): unknown[] {
    return [
      transaction.id,
      transaction.amount,
      transaction.description,
      transaction.date,
      transaction.category,
      transaction.method,
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

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
}
