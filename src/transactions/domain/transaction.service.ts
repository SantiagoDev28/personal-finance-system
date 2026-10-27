import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { TransactionType } from './transaction.enum';
import { TransactionMemory } from './transaction.memory';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionMemory: TransactionMemory) {}

  create(transaction: Transaction): Transaction {
    const newTransaction = Transaction.create(transaction);
    this.transactionMemory.save(newTransaction);
    return newTransaction;
  }

  findAll(): Transaction[] {
    return this.transactionMemory.findAll();
  }
  findById(id: string): Transaction {
    return this.transactionMemory.findById(id);
  }
  resume() {
    const summary = this.transactionMemory.findAll().reduce(
      (acc, transaction) => {
        if (transaction.type === TransactionType.INCOME) {
          acc.income += transaction.amount;
        } else if (transaction.type === TransactionType.EXPENSE) {
          acc.expense += transaction.amount;
        }

        return acc;
      },
      { income: 0, expense: 0 },
    );

    return {
      income: summary.income,
      expense: summary.expense,
      balance: summary.income - summary.expense,
    };
  }
}
