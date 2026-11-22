import { Inject, Injectable } from '@nestjs/common';
import { CARD_PAYMENT_REPOSITORY } from '../../card-payments/domain/repositories/card-payment-repository.token';
import type { CardPaymentRepository } from '../../card-payments/domain/repositories/card-payment.repository';
import { isCashAccount } from '../../transactions/domain/enums/transaction.enum';
import { TRANSACTION_REPOSITORY } from '../../transactions/domain/repositories/transaction-repository.token';
import type { TransactionRepository } from '../../transactions/domain/repositories/transaction.repository';
import { AccountMovementsDto } from './dto/account-movements.dto';

export type AccountMovement = {
  kind: 'income' | 'expense' | 'card_payment';
  id: string;
  amount: number;
  account: string;
  date: Date;
  description: string;
  category?: string;
};

@Injectable()
export class AccountMovementService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepository,
    @Inject(CARD_PAYMENT_REPOSITORY)
    private readonly cardPayments: CardPaymentRepository,
  ) {}

  async list(query: AccountMovementsDto): Promise<AccountMovement[]> {
    const transactions = await this.transactions.findByFilter(query);
    const payments = isCashAccount(query.account)
      ? await this.cardPayments.findByFilter({
          sourceAccount: query.account,
          startDate: query.startDate,
          endDate: query.endDate,
        })
      : [];

    return [
      ...transactions.map((transaction) => ({
        kind: transaction.type,
        id: transaction.id,
        amount: transaction.amount,
        account: transaction.account,
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
      })),
      ...payments.map((payment) => ({
        kind: 'card_payment' as const,
        id: payment.id,
        amount: payment.amount,
        account: payment.sourceAccount,
        date: payment.date,
        description: payment.description,
      })),
    ].sort(byDateThenId);
  }
}

function byDateThenId(left: AccountMovement, right: AccountMovement): number {
  const byDate = left.date.getTime() - right.date.getTime();
  if (byDate !== 0) {
    return byDate;
  }
  return left.id < right.id ? -1 : 1;
}
