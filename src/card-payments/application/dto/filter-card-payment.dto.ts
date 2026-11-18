import { IsIn, IsOptional, IsString } from 'class-validator';
import { CASH_ACCOUNTS } from '../../../transactions/domain/enums/transaction.enum';

export class FilterCardPaymentDto {
  @IsOptional()
  @IsIn(CASH_ACCOUNTS)
  sourceAccount?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
