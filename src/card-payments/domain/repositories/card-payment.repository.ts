import { CardPayment } from '../entities/card-payment.entity';
import { CardPaymentFilter } from './card-payment-filter';

export interface CardPaymentRepository {
  save(payment: CardPayment): Promise<CardPayment>;
  update(payment: CardPayment): Promise<CardPayment>;
  findAll(): Promise<CardPayment[]>;
  findById(id: string): Promise<CardPayment>;
  findByFilter(filter: CardPaymentFilter): Promise<CardPayment[]>;
  delete(id: string): Promise<string>;
}
