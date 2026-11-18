import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../domain/entities/transaction.entity';
import { updateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import type { TransactionRepository } from '../domain/repositories/transaction.repository';
import { TRANSACTION_REPOSITORY } from '../domain/repositories/transaction-repository.token';
import { startOfUtcDay } from '../domain/repositories/transaction-filter';
import { CARD_PAYMENT_REPOSITORY } from '../../card-payments/domain/repositories/card-payment-repository.token';
import type { CardPaymentRepository } from '../../card-payments/domain/repositories/card-payment.repository';
import { cardDebt, cashResume } from '../domain/cash-resume';
import {
  isAccount,
  isCashAccount,
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
  description?: string;
  category: string;
  account: string;
  type: TransactionType;
  date: string;
}): NewTransaction {
  return {
    id: body.id,
    amount: body.amount,
    description: body.description,
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
    @Inject(CARD_PAYMENT_REPOSITORY)
    private readonly cardPayments: CardPaymentRepository,
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
    await this.assertOutstanding(existingTransaction, updatedTransaction);
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
    const payments = await this.flowPayments(filter);
    const historyPayments = filter?.endDate
      ? await this.cardPayments.findByFilter({ endDate: filter.endDate })
      : await this.cardPayments.findAll();
    return cashResume(transactions, history, payments, historyPayments);
  }

  async delete(id: string): Promise<{ message: string }> {
    const existing = await this.transactionRepository.findById(id);
    await this.assertOutstanding(existing, null);
    await this.transactionRepository.delete(id);
    return {
      message: `Transaction with id ${id} deleted successfully`,
    };
  }

  private async assertOutstanding(
    before: Transaction,
    after: Transaction | null,
  ): Promise<void> {
    const movements = await this.transactionRepository.findAll();
    const payments = await this.cardPayments.findAll();
    const outstanding = cashResume([], movements, [], payments).cardOutstanding;
    const next =
      outstanding - cardDebt(before) + (after === null ? 0 : cardDebt(after));
    if (next < 0) {
      throw new BadRequestException('Card outstanding would be below zero');
    }
  }

  private flowPayments(filter?: FilterTransactionDto) {
    if (!filter) {
      return this.cardPayments.findAll();
    }
    if (filter.category || filter.type) {
      return Promise.resolve([]);
    }
    if (filter.account && !isCashAccount(filter.account)) {
      return Promise.resolve([]);
    }
    return this.cardPayments.findByFilter({
      sourceAccount: filter.account,
      startDate: filter.startDate,
      endDate: filter.endDate,
    });
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
