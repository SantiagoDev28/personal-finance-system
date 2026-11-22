import { Controller, Get, Query } from '@nestjs/common';
import {
  AccountMovement,
  AccountMovementService,
} from '../../application/account-movement.service';
import { AccountMovementsDto } from '../../application/dto/account-movements.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly movements: AccountMovementService) {}

  @Get('movements')
  list(@Query() query: AccountMovementsDto): Promise<AccountMovement[]> {
    return this.movements.list(query);
  }
}
