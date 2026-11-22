import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  Account,
  TransactionCategory,
  TransactionType,
} from '../../domain/enums/transaction.enum';

export class FilterTransactionDto {
  @IsOptional()
  @IsEnum(TransactionCategory)
  category?: TransactionCategory;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsEnum(Account)
  account?: Account;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
