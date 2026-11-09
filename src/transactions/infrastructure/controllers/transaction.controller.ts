import { Controller, Body, Post, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { TransactionService } from '../../application/transaction.service';
import { Transaction } from '../../domain/entities/transaction.entity';
import { updateTransactionDto } from '../../application/dto/update-transaction.dto';
import { createTransactionDto } from '../../application/dto/create-transaction.dto';
import { FilterTransactionDto } from '../../application/dto/filter-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  create(@Body() transaction: createTransactionDto): Transaction {
    const transactionData = {
      ...transaction,
      date: new Date(transaction.date),
    };
    return this.transactionService.create(transactionData);
  }

  @Get()
  findAll(@Query() filter: FilterTransactionDto): Transaction[] {
    return this.transactionService.findAll(filter);
  }

  @Get('resume')
  resume(@Query() filter: FilterTransactionDto) {
    return this.transactionService.resume(filter);
  }

  @Get(':id')
  findById(@Param('id') id: string): Transaction {
    return this.transactionService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() transaction: updateTransactionDto): Transaction {
    return this.transactionService.update(id, transaction);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { message: string; } {
    return this.transactionService.delete(id);
  }
}
