import { Module } from '@nestjs/common';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { TransactionMemory } from './infrastructure/persistence/transaction.memory';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction-repository.token';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionMemory,
    },
  ],
})
export class TransactionModule {}
