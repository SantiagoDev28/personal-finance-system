import { ConflictException, NotFoundException } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import {
  TransactionFilter,
  filterDateBounds,
} from '../../domain/repositories/transaction-filter';

export class TransactionMemory implements TransactionRepository {
  private transactions: Transaction[] = [];

  save(newTransaction: Transaction): Promise<Transaction> {
    if (
      this.transactions.find(
        (transaction) => transaction.id === newTransaction.id,
      )
    ) {
      throw new ConflictException(
        `Transaction with id ${newTransaction.id} already exists`,
      );
    }
    this.transactions.push(newTransaction);
    return Promise.resolve(newTransaction);
  }

  update(updatedTransaction: Transaction): Promise<Transaction> {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === updatedTransaction.id,
    );

    if (index === -1) {
      throw new NotFoundException(
        `Transaction with id ${updatedTransaction.id} not found`,
      );
    }

    this.transactions[index] = updatedTransaction;
    return Promise.resolve(updatedTransaction);
  }

  findAll(): Promise<Transaction[]> {
    return Promise.resolve(this.sorted(this.transactions));
  }

  findById(id: string): Promise<Transaction> {
    const transaction = this.transactions.find((item) => item.id === id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return Promise.resolve(transaction);
  }

  findByFilter(filter: TransactionFilter): Promise<Transaction[]> {
    const { start, end } = filterDateBounds(filter);
    const matches = this.transactions.filter((transaction) => {
      const matchesType = !filter.type || transaction.type === filter.type;
      const matchesCategory =
        !filter.category || transaction.category === filter.category;
      const matchesStartDate = !start || transaction.date >= start;
      const matchesEndDate = !end || transaction.date <= end;
      return (
        matchesType && matchesCategory && matchesStartDate && matchesEndDate
      );
    });
    return Promise.resolve(this.sorted(matches));
  }

  delete(id: string): Promise<string> {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    this.transactions.splice(index, 1);
    return Promise.resolve(`Successfully deleted transaction with id ${id}`);
  }

  private sorted(transactions: Transaction[]): Transaction[] {
    return [...transactions].sort((left, right) => {
      const byDate = left.date.getTime() - right.date.getTime();
      if (byDate !== 0) {
        return byDate;
      }
      if (left.id === right.id) {
        return 0;
      }
      return left.id < right.id ? -1 : 1;
    });
  }
}
