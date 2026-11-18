import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../domain/entities/transaction.entity';
import { updateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import type { TransactionRepository } from '../domain/repositories/transaction.repository';
import { TRANSACTION_REPOSITORY } from '../domain/repositories/transaction-repository.token';
import { startOfUtcDay } from '../domain/repositories/transaction-filter';
import { cashResume } from '../domain/cash-resume';
import {
  isAccount,
  isCategoryForType,
  TransactionType,
} from '../domain/enums/transaction.enum';

export type NewTransaction = {
  id?: string;
  amount: number;
  description?: string;
  category: string;
  account: string;
  type: TransactionType;
  date: Date;
};

export function shortcutTransaction(body: {
  id?: string;
  amount: number;
  category: string;
  account: string;
  type: TransactionType;
  date: string;
}): NewTransaction {
  return {
    id: body.id,
    amount: body.amount,
    category: body.category,
    account: body.account,
    type: body.type,
    date: startOfUtcDay(body.date),
  };
}

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(transaction: NewTransaction): Promise<Transaction> {
    assertShortcut(transaction);
    const description = transaction.description?.trim() || transaction.category;
    const newTransaction = Transaction.create({
      id: transaction.id?.trim() || randomUUID(),
      amount: transaction.amount,
      description,
      category: transaction.category,
      account: transaction.account,
      type: transaction.type,
      date: transaction.date,
    });
    await this.transactionRepository.save(newTransaction);
    return newTransaction;
  }

  async update(id: string, data: updateTransactionDto): Promise<Transaction> {
    const existingTransaction = await this.transactionRepository.findById(id);
    const category = data.category ?? existingTransaction.category;
    const account = data.account ?? existingTransaction.account;
    const type = data.type ?? existingTransaction.type;
    if (
      data.category !== undefined ||
      data.account !== undefined ||
      data.type !== undefined
    ) {
      assertShortcut({ category, account, type });
    }

    const updatedTransaction = Transaction.create({
      id: existingTransaction.id,
      amount: data.amount ?? existingTransaction.amount,
      description: data.description ?? existingTransaction.description,
      category,
      account,
      type,
      date:
        data.date !== undefined
          ? new Date(data.date)
          : existingTransaction.date,
    });
    return this.transactionRepository.update(updatedTransaction);
  }

  async findAll(filter: FilterTransactionDto): Promise<Transaction[]> {
    return await this.transactionRepository.findByFilter(filter);
  }

  async findById(id: string): Promise<Transaction> {
    return await this.transactionRepository.findById(id);
  }

  async resume(filter?: FilterTransactionDto) {
    const transactions = filter
      ? await this.transactionRepository.findByFilter(filter)
      : await this.transactionRepository.findAll();
    const history = filter
      ? await historyOf(this.transactionRepository, filter)
      : transactions;
    return cashResume(transactions, history);
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.transactionRepository.delete(id);
    return {
      message: `Transaction with id ${id} deleted successfully`,
    };
  }
}

async function historyOf(
  repository: TransactionRepository,
  filter?: FilterTransactionDto,
): Promise<Transaction[]> {
  if (!filter) {
    return repository.findAll();
  }
  if (filter.endDate) {
    return repository.findByFilter({ endDate: filter.endDate });
  }
  return repository.findAll();
}

function assertShortcut(data: {
  category: string;
  account: string;
  type: TransactionType;
}): void {
  if (!isAccount(data.account)) {
    throw new BadRequestException('Account is not valid');
  }
  if (!isCategoryForType(data.category, data.type)) {
    throw new BadRequestException('Category is not valid for this type');
  }
}

