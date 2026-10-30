import { HttpStatus, Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { updateTransactionDto } from './dto/update-transaction.dto';
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
