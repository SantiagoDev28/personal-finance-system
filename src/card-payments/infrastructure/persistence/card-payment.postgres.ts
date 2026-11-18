import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

import { DATABASE_POOL } from '../../../database/database.module';
import { filterDateBounds } from '../../../transactions/domain/repositories/transaction-filter';
import { CardPayment } from '../../domain/entities/card-payment.entity';
import { CardPaymentFilter } from '../../domain/repositories/card-payment-filter';
import { CardPaymentRepository } from '../../domain/repositories/card-payment.repository';
import { CardPaymentRow, mapRowToCardPayment } from './card-payment.mapper';
import { readOutstanding, rollback } from './card-ledger';

const PAYMENT_SELECT = `
  SELECT
    p.id,
    p.amount,
    p.source_account,
    p.card_account,
    p.description,
    p.date
  FROM card_payments p
`;

@Injectable()
export class CardPaymentPostgres implements CardPaymentRepository {
  constructor(
    @Inject(DATABASE_POOL)
    private readonly pool: Pool,
  ) {}

  async save(payment: CardPayment): Promise<CardPayment> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await lockLedger(client);
      const outstanding = await readOutstanding(client);
      if (payment.amount > outstanding) {
        throw new BadRequestException(
          'Card payment exceeds the outstanding balance',
        );
      }
      await client.query(
        `
        INSERT INTO card_payments (
          id, amount, source_account, card_account, description, date
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        this.bound(payment),
      );
      await client.query('COMMIT');
      return payment;
    } catch (error) {
      await rollback(client);
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          `Card payment with id ${payment.id} already exists`,
        );
      }
      throw error;
    } finally {
      client.release();
    }
  }

  async update(payment: CardPayment): Promise<CardPayment> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await lockLedger(client);
      const previous = await client.query<{ amount: string }>(
        'SELECT amount FROM card_payments WHERE id = $1',
        [payment.id],
      );
      if ((previous.rowCount ?? 0) === 0) {
        throw new NotFoundException(
          `Card payment with id ${payment.id} not found`,
        );
      }
      const outstanding = await readOutstanding(client);
      const next =
        outstanding + Number(previous.rows[0]?.amount ?? 0) - payment.amount;
      if (next < 0) {
        throw new BadRequestException('Card outstanding would be below zero');
      }
      await client.query(
        `
        UPDATE card_payments
        SET
          amount = $2,
          source_account = $3,
          card_account = $4,
          description = $5,
          date = $6
        WHERE id = $1
        `,
        this.bound(payment),
      );
      await client.query('COMMIT');
      return payment;
    } catch (error) {
      await rollback(client);
      throw error;
    } finally {
      client.release();
    }
  }

  findAll(): Promise<CardPayment[]> {
    return this.queryPayments('', []);
  }

  async findById(id: string): Promise<CardPayment> {
    const rows = await this.queryPayments('WHERE p.id = $1', [id]);
    const payment = rows[0];
    if (!payment) {
      throw new NotFoundException(`Card payment with id ${id} not found`);
    }
    return payment;
  }

  findByFilter(filter: CardPaymentFilter): Promise<CardPayment[]> {
    const { start, end } = filterDateBounds(filter);
    if (
      (start && Number.isNaN(start.getTime())) ||
      (end && Number.isNaN(end.getTime()))
    ) {
      return Promise.resolve([]);
    }

    const clauses: string[] = [];
    const values: unknown[] = [];
    if (filter.sourceAccount) {
      values.push(filter.sourceAccount);
      clauses.push(`p.source_account = $${values.length}`);
    }
    if (start) {
      values.push(start);
      clauses.push(`p.date >= $${values.length}`);
    }
    if (end) {
      values.push(end);
      clauses.push(`p.date <= $${values.length}`);
    }
    const where = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    return this.queryPayments(where, values);
  }

  async delete(id: string): Promise<string> {
    const result = await this.pool.query(
      'DELETE FROM card_payments WHERE id = $1',
      [id],
    );
    if ((result.rowCount ?? 0) === 0) {
      throw new NotFoundException(`Card payment with id ${id} not found`);
    }
    return `Successfully deleted card payment with id ${id}`;
  }

  private bound(payment: CardPayment): unknown[] {
    return [
      payment.id,
      payment.amount,
      payment.sourceAccount,
      payment.cardAccount,
      payment.description,
      payment.date,
    ];
  }

  private async queryPayments(
    where: string,
    values: unknown[],
  ): Promise<CardPayment[]> {
    const result = await this.pool.query<CardPaymentRow>(
      `${PAYMENT_SELECT} ${where} ORDER BY p.date ASC, p.id ASC`,
      values,
    );
    return result.rows.map(mapRowToCardPayment);
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
