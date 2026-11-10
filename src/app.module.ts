import { Module } from '@nestjs/common';
import { TransactionModule } from './transactions/transaction.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [TransactionModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
