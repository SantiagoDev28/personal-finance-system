import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CardPaymentService,
  cardPaymentFromBody,
} from '../../application/card-payment.service';
import { CreateCardPaymentDto } from '../../application/dto/create-card-payment.dto';
import { FilterCardPaymentDto } from '../../application/dto/filter-card-payment.dto';
import { UpdateCardPaymentDto } from '../../application/dto/update-card-payment.dto';
import { CardPayment } from '../../domain/entities/card-payment.entity';

@Controller('card-payments')
export class CardPaymentController {
  constructor(private readonly cardPayments: CardPaymentService) {}

  @Post()
  create(@Body() body: CreateCardPaymentDto): Promise<CardPayment> {
    return this.cardPayments.create(cardPaymentFromBody(body));
  }

  @Get()
  findAll(@Query() filter: FilterCardPaymentDto): Promise<CardPayment[]> {
    return this.cardPayments.findAll(filter);
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<CardPayment> {
    return this.cardPayments.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateCardPaymentDto,
  ): Promise<CardPayment> {
    return this.cardPayments.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.cardPayments.delete(id);
  }
}
