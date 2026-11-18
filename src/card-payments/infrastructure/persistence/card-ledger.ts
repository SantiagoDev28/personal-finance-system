import { PoolClient } from 'pg';
import {
  Account,
  TransactionType,
} from '../../../transactions/domain/enums/transaction.enum';

export async function readOutstanding(client: PoolClient): Promise<number> {
  const result = await client.query<{ outstanding: string }>(
    `
    SELECT
      COALESCE((
        SELECT SUM(amount)
        FROM transactions
        WHERE type = $1 AND account = $2
      ), 0)
      - COALESCE((SELECT SUM(amount) FROM card_payments), 0)
      AS outstanding
    `,
    [TransactionType.EXPENSE, Account.TARJETA_CREDITO],
  );
  return Number(result.rows[0]?.outstanding ?? 0);
}

export async function rollback(client: PoolClient): Promise<void> {
  try {
    await client.query('ROLLBACK');
  } catch {
    return;
  }
}
