import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { DATABASE_POOL } from '../../../database/database.module';
import { Transaction } from '../../domain/entities/transaction.entity';
import {
  TransactionRow,
  mapRowToTransaction,
} from './transaction.mapper';

@Injectable()
export class TransactionPostgres {
  constructor(
    @Inject(DATABASE_POOL)
    private readonly pool: Pool,
  ) {}

  async findAll(): Promise<Transaction[]> {
    const result = await this.pool.query<TransactionRow>(`
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
    `);

    return result.rows.map(mapRowToTransaction);
  }
}