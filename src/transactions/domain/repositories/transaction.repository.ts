import { Transaction } from '../entities/transaction.entity';
import { FilterTransactionDto } from '../../application/dto/filter-transaction.dto';

export interface TransactionRepository {
    save(transaction: Transaction): Transaction;
    update(transaction: Transaction): Transaction;
    findAll(): Transaction[];
    findById(id: string): Transaction;
    findByFilter(filter: FilterTransactionDto): Transaction[];
    delete(id: string): string;
}
