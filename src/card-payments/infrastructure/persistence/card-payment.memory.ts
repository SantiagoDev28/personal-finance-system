import { ConflictException, NotFoundException } from '@nestjs/common';
import { filterDateBounds } from '../../../transactions/domain/repositories/transaction-filter';
import { CardPayment } from '../../domain/entities/card-payment.entity';
import { CardPaymentFilter } from '../../domain/repositories/card-payment-filter';
import { CardPaymentRepository } from '../../domain/repositories/card-payment.repository';

export class CardPaymentMemory implements CardPaymentRepository {
  private payments: CardPayment[] = [];

  save(payment: CardPayment): Promise<CardPayment> {
    if (this.payments.some((stored) => stored.id === payment.id)) {
      throw new ConflictException(
        `Card payment with id ${payment.id} already exists`,
      );
    }
    this.payments.push(payment);
    return Promise.resolve(payment);
  }

  update(payment: CardPayment): Promise<CardPayment> {
    const index = this.payments.findIndex((stored) => stored.id === payment.id);
    if (index === -1) {
      throw new NotFoundException(
        `Card payment with id ${payment.id} not found`,
      );
    }
    this.payments[index] = payment;
    return Promise.resolve(payment);
  }

  findAll(): Promise<CardPayment[]> {
    return Promise.resolve(this.sorted(this.payments));
  }

  findById(id: string): Promise<CardPayment> {
    const payment = this.payments.find((stored) => stored.id === id);
    if (!payment) {
      throw new NotFoundException(`Card payment with id ${id} not found`);
    }
    return Promise.resolve(payment);
  }

  findByFilter(filter: CardPaymentFilter): Promise<CardPayment[]> {
    const { start, end } = filterDateBounds(filter);
    const matches = this.payments.filter((payment) => {
      const matchesAccount =
        !filter.sourceAccount || payment.sourceAccount === filter.sourceAccount;
      const matchesStart = !start || payment.date >= start;
      const matchesEnd = !end || payment.date <= end;
      return matchesAccount && matchesStart && matchesEnd;
    });
    return Promise.resolve(this.sorted(matches));
  }

  delete(id: string): Promise<string> {
    const index = this.payments.findIndex((stored) => stored.id === id);
    if (index === -1) {
      throw new NotFoundException(`Card payment with id ${id} not found`);
    }
    this.payments.splice(index, 1);
    return Promise.resolve(`Successfully deleted card payment with id ${id}`);
  }

  private sorted(payments: CardPayment[]): CardPayment[] {
    return [...payments].sort((left, right) => {
      const byDate = left.date.getTime() - right.date.getTime();
      if (byDate !== 0) {
        return byDate;
      }
      return left.id < right.id ? -1 : 1;
    });
  }
}
