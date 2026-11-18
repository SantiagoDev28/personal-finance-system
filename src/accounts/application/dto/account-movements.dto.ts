import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Account } from '../../../transactions/domain/enums/transaction.enum';

export class AccountMovementsDto {
  @IsEnum(Account)
  account!: Account;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
