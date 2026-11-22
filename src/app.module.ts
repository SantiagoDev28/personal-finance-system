import { Module } from '@nestjs/common';
import { AccountModule } from './accounts/account.module';
import { CardPaymentModule } from './card-payments/card-payment.module';
import { TransactionModule } from './transactions/transaction.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TransactionModule,
    CardPaymentModule,
    AccountModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
