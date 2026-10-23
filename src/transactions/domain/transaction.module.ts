import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionMemory } from './transaction.memory';

@Module({
    imports: [],
    controllers: [ TransactionController ],
    providers: [ TransactionService, TransactionMemory ],
})
export class TransactionModule {}