import { Module } from '@nestjs/common';
import { TransactionModule } from '../transactions/transaction.module';
import { CardPaymentService } from './application/card-payment.service';
import { CARD_PAYMENT_REPOSITORY } from './domain/repositories/card-payment-repository.token';
import { CardPaymentController } from './infrastructure/controllers/card-payment.controller';
import { CardPaymentPostgres } from './infrastructure/persistence/card-payment.postgres';

@Module({
  imports: [TransactionModule],
  controllers: [CardPaymentController],
  providers: [
    CardPaymentService,
    {
      provide: CARD_PAYMENT_REPOSITORY,
      useClass: CardPaymentPostgres,
    },
  ],
  exports: [CARD_PAYMENT_REPOSITORY, CardPaymentService],
})
export class CardPaymentModule {}
