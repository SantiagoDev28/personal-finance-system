import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() transaction: Transaction): Transaction {
    const transactionData = {
        ...transaction,
        date: new Date(transaction.date),
    };
    return this.transactionService.create(transactionData);
  }

  @Get()
  findAll(): Transaction[] {
    return this.transactionService.findAll();
  }

  @Get('resume')
  resume(): { income: number, expense: number, balance: number } {
    return this.transactionService.resume();
  }

  @Get(':id')
  findById(@Param('id') id: string): Transaction {
    return this.transactionService.findById(id);
  }
}