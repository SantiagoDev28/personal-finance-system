import { TransactionMethod, TransactionType } from './transaction.enum';
import { BadRequestException } from '@nestjs/common';

export class Transaction {
  private constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly category: string,
    public readonly method: TransactionMethod,
    public readonly type: TransactionType,
    public readonly date: Date,
  ) {}

  public static create(data: {
    id: string;
    amount: number;
    description: string;
    category: string;
    method: TransactionMethod;
    type: TransactionType;
    date: Date;
  }): Transaction {
    if (data.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    if (!Number.isInteger(data.amount)) {
      throw new BadRequestException('Amount must be an integer');
    }
    if (
      !data.id.trim() ||
      !data.category.trim() ||
      !data.method.trim() ||
      !data.type.trim()
    ) {
      throw new BadRequestException(
        `${data.id.trim()}, ${data.category.trim()}, ${data.method.trim()}, ${data.type.trim()} are required`,
      );
    }
    if (Number.isNaN(data.date.getTime())) {
      throw new BadRequestException(`Date must be a valid date`);
    }
    if (
      data.type !== TransactionType.INCOME &&
      data.type !== TransactionType.EXPENSE
    ) {
      throw new BadRequestException(`Type must be a valid type`);
    }
    return new Transaction(
      data.id,
      data.amount,
      data.description,
      data.category,
      data.method,
      data.type,
      data.date,
    );
  }
  public static update(data: {
    id: string;
    amount: number;
    description: string;
    category: string;
    method: TransactionMethod;
    type: TransactionType;
    date: Date;
  }): Transaction {
    return Transaction.create({
      id: data.id,
      amount: data.amount,
      description: data.description,
      category: data.category,
      method: data.method,
      type: data.type,
      date: data.date,
    });
  }
}
