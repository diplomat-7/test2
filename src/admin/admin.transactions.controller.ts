import {
  Get,
  Body,
  Query,
  Post,
  Request,
  UseGuards,
  Controller,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Transaction as T, WhereOptions, FindAndCountOptions } from 'sequelize';

import { AuthGuard } from 'src/commons/guards/auth.guard';
import { UserTypeGuard } from 'src/commons/guards/user_type.guard';
import { TransactionGuard } from 'src/transactions/transaction.guard';

import { USER_TYPE } from 'src/user/user.constants';
import { DOCUMENT_ATTRIBUTES } from 'src/document/document.constants';

import { IRequest } from 'src/commons/interface/interface';
import { ITransaction } from 'src/transactions/transactions.interface';

import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from 'src/transactions/transactions.constants';
import { ApproveTxnDTO, TxnListDtO } from 'src/transactions/transaction.dto';
import { UserType } from 'src/commons/commons.decorator';

import { BalanceService } from 'src/balance/balance.service';
import { TransactionsService } from 'src/transactions/transactions.service';

import { Document } from 'src/document/document.model';
import { Transaction } from 'src/transactions/transactions.model';

@Controller('admin/transactions')
@UserType(USER_TYPE.ADMINS)
@UseGuards(AuthGuard, UserTypeGuard)
export class AdminTransactionsController {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly balanceService: BalanceService,
    private readonly transactionService: TransactionsService,
  ) {}

  @Get()
  async list(@Query() query: TxnListDtO) {
    let where: WhereOptions<Transaction> = {};

    if (query.type) where.type = query.type;

    if (query.status) where.status = query.status;

    if (query.wallet_id) where.wallet_id = query.wallet_id;

    if (query.balance_id) where.balance_id = query.balance_id;

    const options: FindAndCountOptions = {
      where,
      include: [
        {
          model: Document,
          attributes: DOCUMENT_ATTRIBUTES,
        },
      ],
      limit: query.limit,
      offset: query.limit * query.offset,
      order: [['id', 'desc']],
    };

    const data = await this.transactionService.search(options);
    return { data: { transactions: data.rows, count: data.count } };
  }

  @Post('/:id/approve_request')
  @UserType(USER_TYPE.A1)
  @UseGuards(UserTypeGuard, TransactionGuard)
  async processDepositRequest(
    @Request() req: IRequest,
    @Body() data: ApproveTxnDTO,
  ) {
    const transaction = req.transaction;

    if (transaction.approved) {
      throw new BadRequestException('Transaction has been approved');
    }

    if (transaction.type !== data.type) {
      throw new BadRequestException('Transaction cannot be processed');
    }

    if (data.status !== TRANSACTION_STATUS.DONE) {
      await this.transactionService.update(
        { approved: true, status: data.status },
        transaction.id,
      );

      return { message: 'Transaction request has been processed' };
    }

    let sequelizeTransaction: T = null;
    let txnUpdateData: ITransaction = {
      approved: true,
      status: data.status,
    };

    try {
      sequelizeTransaction = await this.sequelize.transaction();

      const balance = await this.balanceService.find({
        id: transaction.balance_id,
      });

      if (data.type === TRANSACTION_TYPES.BANK_TO_BALANCE) {
        await this.balanceService.fund({
          balance,
          amount: data.amount,
          transaction: sequelizeTransaction,
        });

        txnUpdateData.amount = data.amount;
      } else {
        await this.balanceService.withdraw({
          balance,
          amount: transaction.amount,
          transaction: sequelizeTransaction,
        });
      }

      await this.transactionService.update(
        txnUpdateData,
        transaction.id,
        sequelizeTransaction,
      );

      await sequelizeTransaction.commit();

      return { message: 'Transaction request has been processed' };
    } catch (error) {
      if (sequelizeTransaction) await sequelizeTransaction.rollback();
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      }
      console.error('[Error]', error.message);
      throw new BadRequestException('Request approval was unsuccessful');
    }
  }
}
