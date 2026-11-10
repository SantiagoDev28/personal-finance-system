import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../domain/entities/transaction.entity';
import { updateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import type { TransactionRepository } from '../domain/repositories/transaction.repository';
import { TRANSACTION_REPOSITORY } from '../domain/repositories/transaction-repository.token';
import { TransactionType } from '../domain/enums/transaction.enum';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) { }

  create(transaction: Transaction): Transaction {
    const newTransaction = Transaction.create(transaction);
    this.transactionRepository.save(newTransaction);
    return newTransaction;
  }

  update(id: string, data: updateTransactionDto): Transaction {
    const existingTransaction = this.transactionRepository.findById(id);

    const updatedTransaction = Transaction.create({
      id: existingTransaction.id,
      amount: data.amount ?? existingTransaction.amount,
      description: data.description ?? existingTransaction.description,
      category: data.category ?? existingTransaction.category,
      method: data.method ?? existingTransaction.method,
      type: data.type ?? existingTransaction.type,
      date: data.date !== undefined ? new Date(data.date) : existingTransaction.date,
    });
    return this.transactionRepository.update(updatedTransaction);

  }

  findAll(filter: FilterTransactionDto): Transaction[] {
    return this.transactionRepository.findByFilter(filter);
  }

  findById(id: string): Transaction {
    return this.transactionRepository.findById(id);
  }

  resume(filter?: FilterTransactionDto) {
    const transactions = filter
      ? this.transactionRepository.findByFilter(filter)
      : this.transactionRepository.findAll();

    const income = transactions
      .filter((transaction) => transaction.type === TransactionType.INCOME)
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
      .filter((transaction) => transaction.type === TransactionType.EXPENSE)
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }

  delete(id: string): { message: string; } {
    this.transactionRepository.delete(id);
    return {
      message: `Transaction with id ${id} deleted successfully`,
    }
  }
}
