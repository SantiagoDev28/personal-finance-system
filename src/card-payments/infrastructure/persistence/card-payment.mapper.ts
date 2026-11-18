import { CardPayment } from '../../domain/entities/card-payment.entity';

export interface CardPaymentRow {
  id: string;
  amount: string;
  source_account: string;
  card_account: string;
  description: string;
  date: Date;
}

export function mapRowToCardPayment(row: CardPaymentRow): CardPayment {
  return CardPayment.create({
    id: row.id,
    amount: Number(row.amount),
    sourceAccount: row.source_account,
    cardAccount: row.card_account,
    description: row.description,
    date: row.date,
  });
}
