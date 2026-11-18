import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCardPaymentDto } from './create-card-payment.dto';

export class UpdateCardPaymentDto extends PartialType(
  OmitType(CreateCardPaymentDto, ['id'] as const),
) {}
