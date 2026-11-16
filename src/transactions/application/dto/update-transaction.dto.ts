import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { createTransactionDto } from './create-transaction.dto';

export class updateTransactionDto extends PartialType(
  OmitType(createTransactionDto, ['id'] as const),
) {
  @IsOptional()
  @IsString()
  description?: string;
}
