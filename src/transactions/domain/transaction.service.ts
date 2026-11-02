import {  Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { updateTransactionDto } from './dto/update-transaction.dto';
import { TransactionMemory } from './transaction.memory';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionMemory: TransactionMemory) {}

  create(transaction: Transaction): Transaction {
    const newTransaction = Transaction.create(transaction);
    this.transactionMemory.save(newTransaction);
    return newTransaction;
  }

  update(id: string, data: updateTransactionDto): Transaction {
    const existingTransaction = this.transactionMemory.findById(id);

    const updatedTransaction = Transaction.create({
      id: existingTransaction.id,
      amount: data.amount ?? existingTransaction.amount,
      description: data.description ?? existingTransaction.description,
      category: data.category ?? existingTransaction.category,
      method: data.method ?? existingTransaction.method,
      type: data.type ?? existingTransaction.type,
      date: data.date !== undefined ? new Date(data.date) : existingTransaction.date,
    });
    return this.transactionMemory.update(updatedTransaction);
    
  }

  delete(id: string): { message: string; } {
    this.transactionMemory.delete(id);
    return {
      message: `Transaction with id ${id} deleted successfully`,
    }
  }

  findAll(filter: FilterTransactionDto): Transaction[] {
    return this.transactionMemory.findByFilter(filter);
  }

  findById(id: string): Transaction {
    return this.transactionMemory.findById(id);
  }
  
  resume(filter?: FilterTransactionDto) {
    const transactions = filter ? this.transactionMemory.findByFilter(filter) : this.transactionMemory.findAll();
    return this.transactionMemory.calculateResume(transactions);
  }
}
