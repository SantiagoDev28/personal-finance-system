import { BadRequestException } from '@nestjs/common';
import {
  Account,
  isCashAccount,
} from '../../../transactions/domain/enums/transaction.enum';

export class CardPayment {
  private constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly sourceAccount: string,
    public readonly cardAccount: string,
    public readonly description: string,
    public readonly date: Date,
  ) {}

  public static create(data: {
    id: string;
    amount: number;
    sourceAccount: string;
    cardAccount?: Account;
    description: string;
    date: Date;
  }): CardPayment {
    if (data.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    if (!Number.isInteger(data.amount)) {
      throw new BadRequestException('Amount must be an integer');
    }
    if (!data.id.trim() || !data.description.trim()) {
      throw new BadRequestException('Id and description are required');
    }
    if (!isCashAccount(data.sourceAccount)) {
      throw new BadRequestException('Source account must be a cash account');
    }
    const cardAccount = data.cardAccount ?? Account.TARJETA_CREDITO;
    if (cardAccount !== Account.TARJETA_CREDITO) {
      throw new BadRequestException('Card account is not valid');
    }
    if (Number.isNaN(data.date.getTime())) {
      throw new BadRequestException('Date must be a valid date');
    }
    return new CardPayment(
      data.id,
      data.amount,
      data.sourceAccount,
      cardAccount,
      data.description,
      data.date,
    );
  }
}
