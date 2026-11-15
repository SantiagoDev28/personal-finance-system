import { PartialType, OmitType } from '@nestjs/mapped-types';
import { createTransactionDto } from './create-transaction.dto';

export class updateTransactionDto extends PartialType(OmitType(createTransactionDto, ['id'] as const)){}