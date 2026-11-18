import { randomUUID } from 'crypto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { cashResume } from '../../transactions/domain/cash-resume';
import { TRANSACTION_REPOSITORY } from '../../transactions/domain/repositories/transaction-repository.token';
import type { TransactionRepository } from '../../transactions/domain/repositories/transaction.repository';
import { startOfUtcDay } from '../../transactions/domain/repositories/transaction-filter';
import { CardPayment } from '../domain/entities/card-payment.entity';
import { CARD_PAYMENT_REPOSITORY } from '../domain/repositories/card-payment-repository.token';
import type { CardPaymentRepository } from '../domain/repositories/card-payment.repository';
import { FilterCardPaymentDto } from './dto/filter-card-payment.dto';
import { UpdateCardPaymentDto } from './dto/update-card-payment.dto';

const DEFAULT_DESCRIPTION = 'Abono tarjeta';

export type NewCardPayment = {
  id?: string;
  amount: number;
  sourceAccount: string;
  description?: string;
  date: Date;
};

export function cardPaymentFromBody(body: {
  id?: string;
  amount: number;
  sourceAccount: string;
  description?: string;
  date: string;
}): NewCardPayment {
  return {
    id: body.id,
    amount: body.amount,
    sourceAccount: body.sourceAccount,
    description: body.description,
    date: startOfUtcDay(body.date),
  };
}

@Injectable()
export class CardPaymentService {
  constructor(
    @Inject(CARD_PAYMENT_REPOSITORY)
    private readonly cardPayments: CardPaymentRepository,
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactions: TransactionRepository,
  ) {}

  async create(payment: NewCardPayment): Promise<CardPayment> {
    const created = CardPayment.create({
      id: payment.id?.trim() || randomUUID(),
      amount: payment.amount,
      sourceAccount: payment.sourceAccount,
      description: payment.description?.trim() || DEFAULT_DESCRIPTION,
      date: payment.date,
    });
    await this.assertFits(created.amount);
    await this.cardPayments.save(created);
    return created;
  }

  async update(id: string, data: UpdateCardPaymentDto): Promise<CardPayment> {
    const existing = await this.cardPayments.findById(id);
    const updated = CardPayment.create({
      id: existing.id,
      amount: data.amount ?? existing.amount,
      sourceAccount: data.sourceAccount ?? existing.sourceAccount,
      cardAccount: existing.cardAccount,
      description: data.description ?? existing.description,
      date: data.date !== undefined ? startOfUtcDay(data.date) : existing.date,
    });
    const increase = updated.amount - existing.amount;
    if (increase > 0) {
      await this.assertFits(increase);
    }
    return this.cardPayments.update(updated);
  }

  findAll(filter: FilterCardPaymentDto): Promise<CardPayment[]> {
    return this.cardPayments.findByFilter(filter);
  }

  findById(id: string): Promise<CardPayment> {
    return this.cardPayments.findById(id);
  }

  async delete(id: string): Promise<{ message: string }> {
    await this.cardPayments.delete(id);
    return { message: `Card payment with id ${id} deleted successfully` };
  }

  async outstanding(): Promise<number> {
    const movements = await this.transactions.findAll();
    const payments = await this.cardPayments.findAll();
    return cashResume([], movements, [], payments).cardOutstanding;
  }

  private async assertFits(amount: number): Promise<void> {
    const outstanding = await this.outstanding();
    if (amount > outstanding) {
      throw new BadRequestException(
        'Card payment exceeds the outstanding balance',
      );
    }
  }
}
