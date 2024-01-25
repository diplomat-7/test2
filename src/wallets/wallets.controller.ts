import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Delete,
  Request,
  UseGuards,
  Controller,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import {
  CreateWalletDTO,
  WalletChargeDTO,
  WalletTxnListDTO,
  WalletUpdateDTO,
} from './wallets.dto';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from 'src/transactions/transactions.constants';

import { WalletGuard } from './wallets.guard';
import { KycCompletedGuard } from 'src/user/user.guard';
import { AuthGuard } from 'src/commons/guards/auth.guard';

import { IRequest } from 'src/commons/interface/interface';

import { WalletsService } from './wallets.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Controller('wallets')
@UseGuards(AuthGuard, KycCompletedGuard)
export class WalletsController {
  constructor(
    private sequelize: Sequelize,
    private walletService: WalletsService,
    private transactionService: TransactionsService,
  ) {}

  @Post()
  async create(@Request() req: IRequest, @Body() data: CreateWalletDTO) {
    const balance = req.balance;
    const wallet = await this.walletService.create({
      name: data.name,
      balance_id: balance.id,
    });

    return {
      message: 'Wallet created successfully',
      data: wallet,
    };
  }

  @Post('/:id/charge')
  @UseGuards(WalletGuard)
  async charge(@Request() req: IRequest, @Body() data: WalletChargeDTO) {
    let transaction: Transaction = null;
    const wallet = req.wallet;
    const balance = req.balance;

    try {
      transaction = await this.sequelize.transaction();

      if (data.transaction_type === TRANSACTION_TYPES.WALLET_TO_BALANCE) {
        await this.walletService.debit({
          wallet,
          transaction,
          amount: data.amount,
        });
      } else {
        await this.walletService.credit({
          wallet,
          transaction,
          amount: data.amount,
        });
      }

      await this.transactionService.create(
        {
          approved: true,
          amount: data.amount,
          wallet_id: wallet.id,
          balance_id: balance.id,
          type: data.transaction_type,
          status: TRANSACTION_STATUS.DONE,
        },
        transaction,
      );

      await transaction.commit();

      return { message: 'Transfer was successful' };
    } catch (error) {
      if (transaction) await transaction.rollback();
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      }
      console.error('[Charge Wallet Error]', error.message);
      throw new BadRequestException('Wallet charge was unsuccessful');
    }
  }

  @Get('/:id')
  @UseGuards(WalletGuard)
  async get(@Request() req: IRequest) {
    return { data: req.wallet };
  }

  @Put('/:id')
  @UseGuards(WalletGuard)
  async update(@Request() req: IRequest, @Body() data: WalletUpdateDTO) {
    await this.walletService.update(data, req.wallet.id);
    return { message: 'Wallet updated successfully' };
  }

  @Delete('/:id')
  @UseGuards(WalletGuard)
  async delete(@Request() req: IRequest) {
    if (Number(req.wallet.allocated_amount) > 0) {
      throw new BadRequestException('Wallet has some allocated funds');
    }

    if (Number(req.wallet.balance) > 0) {
      throw new BadRequestException(
        'Wallet has some funds, kindly move them to your balance and try again',
      );
    }

    await this.walletService.delete(req.wallet.id);
    return { message: 'Wallet removed successfully' };
  }

  @Get('/:id/transactions')
  @UseGuards(WalletGuard)
  async transactions(
    @Request() req: IRequest,
    @Query() query: WalletTxnListDTO,
  ) {
    const transactions = await this.transactionService.list({
      wallet_id: req.wallet.id,
      ...query,
    });

    return { data: transactions };
  }
}
