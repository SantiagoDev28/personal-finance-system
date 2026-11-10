import { Transaction } from '../entities/transaction.entity';
import { TransactionFilter } from './transaction-filter';

export interface TransactionRepository {
    save(transaction: Transaction): Transaction;
    update(transaction: Transaction): Transaction;
    findAll(): Transaction[];
    findById(id: string): Transaction;
    findByFilter(filter: TransactionFilter): Transaction[];
    delete(id: string): string;
}