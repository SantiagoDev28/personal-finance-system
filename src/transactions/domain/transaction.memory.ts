import { ConflictException, NotFoundException } from '@nestjs/common';
import { Transaction } from './transaction.entity';

export class TransactionMemory {
  private transactions: Transaction[] = [];

  save(newTransaction: Transaction): Transaction {
    if (this.transactions.find((transaction) => transaction.id === newTransaction.id)) {
      throw new ConflictException(`Transaction with id ${newTransaction.id} already exists`);
    }
    this.transactions.push(newTransaction);
    return newTransaction;
  }
  update(updatedTransaction: Transaction): Transaction {
    const index = this.transactions.findIndex(
    (transaction) => transaction.id === updatedTransaction.id,
    )
    
    if(index === -1){
      throw new NotFoundException (
        `Transaction with id ${updatedTransaction.id} not found`
      )
    }

    this.transactions[index] = updatedTransaction;

    return updatedTransaction;
  }
  findAll(): Transaction[] {
    return this.transactions;
  }
  findById(id: string): Transaction {
    const transaction = this.transactions.find(
      (transaction) => transaction.id === id,
    );
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  delete(id: string): string {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === id,
    );
    if (index === -1) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    this.transactions.splice(index, 1);
    return `Successfully deleted transaction with id ${id}`;
  }
}
