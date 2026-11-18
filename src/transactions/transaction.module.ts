import { Module } from '@nestjs/common';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { TransactionPostgres } from './infrastructure/persistence/transaction.postgres';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction-repository.token';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionPostgres,
    },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionModule {}
