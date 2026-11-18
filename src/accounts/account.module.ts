import { Module } from '@nestjs/common';
import { CardPaymentModule } from '../card-payments/card-payment.module';
import { TransactionModule } from '../transactions/transaction.module';
import { AccountMovementService } from './application/account-movement.service';
import { AccountController } from './infrastructure/controllers/account.controller';

@Module({
  imports: [TransactionModule, CardPaymentModule],
  controllers: [AccountController],
  providers: [AccountMovementService],
})
export class AccountModule {}
