import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { CalendarDateConstraint } from '../../../transactions/application/dto/create-transaction.dto';
import { CASH_ACCOUNTS } from '../../../transactions/domain/enums/transaction.enum';

export class CreateCardPaymentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsInt()
  @IsPositive()
  amount!: number;

  @IsIn(CASH_ACCOUNTS)
  sourceAccount!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @Validate(CalendarDateConstraint)
  date!: string;
}
