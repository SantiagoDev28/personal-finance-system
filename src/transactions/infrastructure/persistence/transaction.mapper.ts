import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionType } from '../../domain/enums/transaction.enum';

export interface TransactionRow {
  id: string;
  amount: string;
  description: string;
  category: string;
  account: string;
  type: string;
  date: Date;
}

export function mapRowToTransaction(row: TransactionRow): Transaction {
  return Transaction.create({
    id: row.id,
    amount: Number(row.amount),
    description: row.description,
    category: row.category,
    account: row.account,
    type: row.type as TransactionType,
    date: row.date,
  });
}
