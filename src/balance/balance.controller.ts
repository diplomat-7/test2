import { Get, Query, Request, UseGuards, Controller } from '@nestjs/common';

import { BalanceTxnListDTO } from './balance.dto';

import { AuthGuard } from 'src/commons/guards/auth.guard';
import { KycCompletedGuard } from 'src/user/user.guard';

import { IRequest } from 'src/commons/interface/interface';

import { BalanceService } from './balance.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Controller('balances')
@UseGuards(AuthGuard, KycCompletedGuard)
export class BalanceController {
  transaction = null;
  constructor(
    private balanceService: BalanceService,
    private transactionService: TransactionsService,
  ) {}

  @Get()
  async get(@Request() req: IRequest) {
    const balance = await this.balanceService.findBalanceById(req.balance.id);
    return { data: balance };
  }

  @Get('/transactions')
  async transactions(
    @Request() req: IRequest,
    @Query() query: BalanceTxnListDTO,
  ) {
    const transactions = await this.transactionService.list({
      balance_id: req.balance.id,
      ...query,
    });

    return { data: transactions };
  }
}
