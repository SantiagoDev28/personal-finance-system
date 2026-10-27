import { Transaction } from './transaction.entity';

export class TransactionMemory {
  private transactions: Transaction[] = [];

  save(newTransaction: Transaction): Transaction {
    this.transactions.push(newTransaction);
    return newTransaction;
  }
  findAll(): Transaction[] {
    return this.transactions;
  }
  findById(id: string): Transaction {
    const transaction = this.transactions.find(
      (transaction) => transaction.id === id,
    );
    if (!transaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    return transaction;
  }
}
