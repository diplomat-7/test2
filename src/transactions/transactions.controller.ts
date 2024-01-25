import {
  Post,
  Body,
  Patch,
  Request,
  UseGuards,
  Controller,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { DOCUMENT_TYPES } from 'src/document/document.constants';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from './transactions.constants';
import { DepositTxnDTO, WithdrawalTxnDTO } from './transaction.dto';
import { IRequest } from 'src/commons/interface/interface';

import { AuthGuard } from 'src/commons/guards/auth.guard';
import { KycCompletedGuard } from 'src/user/user.guard';

import { BanksService } from 'src/banks/banks.service';
import { TransactionsService } from './transactions.service';
import { DocumentService } from 'src/document/document.service';
import { TransactionGuard } from './transaction.guard';

@Controller('transactions')
@UseGuards(AuthGuard, KycCompletedGuard)
export class TransactionsController {
  constructor(
    private sequelize: Sequelize,
    private bankService: BanksService,
    private documentService: DocumentService,
    private transactionService: TransactionsService,
  ) {}

  @Patch('/:id/cancel_request')
  @UseGuards(TransactionGuard)
  async cancel(@Request() req: IRequest) {
    if (req.transaction.status !== TRANSACTION_STATUS.PENDING) {
      throw new BadRequestException('Transaction cannot be canceled');
    }

    await this.transactionService.update(
      { status: TRANSACTION_STATUS.CANCELED },
      req.transaction.id,
    );
    return { message: 'Transaction canceled' };
  }

  @Post('/create_deposit_request')
  async deposit(@Request() req: IRequest, @Body() data: DepositTxnDTO) {
    const balance = req.balance;

    let transaction: Transaction = null;

    try {
      transaction = await this.sequelize.transaction();

      const response = await this.transactionService.create(
        {
          balance_id: balance.id,
          document_id: data.documentId,
          type: TRANSACTION_TYPES.BANK_TO_BALANCE,
        },
        transaction,
      );

      await this.documentService.tieModelToDocument({
        documentId: data.documentId,
        data: {
          user_id: req.user.id,
          transaction_id: response.id,
        },
        transaction,
        type: DOCUMENT_TYPES.DEPOSIT_RECEIPT,
      });

      await transaction.commit();

      return { message: 'Transaction created successfully' };
    } catch (error) {
      if (transaction) await transaction.rollback();
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      }
      console.error('[Create Transaction Error]', error?.message);
      throw new BadRequestException('Unable to create transaction');
    }
  }

  @Post('/create_withdrawal_request')
  async withdraw(@Request() req: IRequest, @Body() data: WithdrawalTxnDTO) {
    const balance = req.balance;

    await this.bankService.validateWithdrawalBank(data.bankId, req.company.id);

    await this.transactionService.withdrawalRequestCheck(data.amount, balance);

    let transaction: Transaction = null;

    try {
      transaction = await this.sequelize.transaction();

      await this.transactionService.create(
        {
          amount: data.amount,
          bank_id: data.bankId,
          balance_id: balance.id,
          type: TRANSACTION_TYPES.BALANCE_TO_BANK,
        },
        transaction,
      );

      await transaction.commit();

      return { message: 'Transaction created successfully' };
    } catch (error) {
      if (transaction) await transaction.rollback();
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      }
      console.error('[Create Transaction Error]', error?.message);
      throw new BadRequestException('Unable to create transaction');
    }
  }
}
