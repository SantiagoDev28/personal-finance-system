import { Transaction } from '../entities/transaction.entity';
import { TransactionFilter } from './transaction-filter';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction>;
  findByFilter(filter: TransactionFilter): Promise<Transaction[]>;
  delete(id: string): Promise<string>;
}
