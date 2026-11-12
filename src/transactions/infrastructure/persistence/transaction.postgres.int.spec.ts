import 'dotenv/config';
import { Pool } from 'pg';

import { readDatabaseConfig } from '../../../database/database-config';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionPostgres } from './transaction.postgres';

describe('TransactionPostgres Integration', () => {
    let pool: Pool;
    let repository: TransactionPostgres;

    beforeAll(async () => {
        const config = readDatabaseConfig(process.env);

        pool = new Pool({
            ...config,
            connectionTimeoutMillis: 3000,
        });

        await pool.query('SELECT 1');

        repository = new TransactionPostgres(pool);
    });

    afterAll(async () => {
        await pool?.end();
    });

    it('should retrieve transactions from PostgreSQL', async () => {
        const transactions = await repository.findAll();

        expect(Array.isArray(transactions)).toBe(true);

        for (const transaction of transactions) {
            expect(transaction).toBeInstanceOf(Transaction);
            expect(typeof transaction.id).toBe('string');
            expect(typeof transaction.amount).toBe('number');
            expect(transaction.date).toBeInstanceOf(Date);
        }
    });
});