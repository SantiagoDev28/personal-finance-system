import { Transaction } from '../entities/transaction.entity';

export interface TransactionRepository {
    save(transaction: Transaction): Transaction;
    update(transaction: Transaction): Transaction;
    findAll(): Transaction[];
    findById(id: string): Transaction;
    delete(id: string): string;
}