import {
  Get,
  Put,
  Post,
  Body,
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
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from 'src/transactions/transactions.constants';

import { BANK_STATUS } from './banks.constants';
import { CreateBankDTO, UpdateBankDTO } from './banks.dto';
import { DOCUMENT_TYPES } from 'src/document/document.constants';

import { BankGuard } from './banks.guard';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IRequest } from 'src/commons/interface/interface';

import { BanksService } from './banks.service';
import { DocumentService } from 'src/document/document.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Controller('banks')
@UseGuards(AuthGuard)
export class BanksController {
  constructor(
    private sequelize: Sequelize,
    private bankService: BanksService,
    private documentService: DocumentService,
    private transactionService: TransactionsService,
  ) {}

  @Post()
  async create(@Request() req: IRequest, @Body() data: CreateBankDTO) {
    let transaction: Transaction = null;

    try {
      transaction = await this.sequelize.transaction();

      const bank = await this.bankService.create(
        {
          company_id: req.company.id,
          ...data,
        },
        transaction,
      );

      await this.documentService.tieModelToDocument({
        documentId: data.documentId,
        data: {
          user_id: req.user.id,
          bank_id: bank.id,
        },
        transaction,
        type: DOCUMENT_TYPES.BANK_RECEIPT,
      });

      await transaction.commit();

      return {
        message: 'Bank created successfully',
        data: bank,
      };
    } catch (error) {
      if (transaction) await transaction.rollback();
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      }
      console.error('[Create Bank Error]', error?.message);
      throw new BadRequestException('Unable to create bank');
    }
  }

  @Get('/:id')
  @UseGuards(BankGuard)
  async get(@Request() req: IRequest) {
    return { data: req.bank };
  }

  @Put('/:id')
  @UseGuards(BankGuard)
  async update(@Request() req: IRequest, @Body() data: UpdateBankDTO) {
    const bank = req.bank;
    let status = bank.status;

    if (data.iban && data.iban !== bank.iban) {
      status = BANK_STATUS.PENDING;
    }

    if (data.documentId) {
      await this.documentService.tieModelToDocument({
        documentId: data.documentId,
        data: {
          user_id: req.user.id,
          bank_id: bank.id,
        },
        type: DOCUMENT_TYPES.BANK_RECEIPT,
      });
      status = BANK_STATUS.PENDING;
    }

    await this.bankService.update({ status, ...data }, bank.id);

    return { message: 'Bank updated successfully' };
  }

  @Delete('/:id')
  @UseGuards(BankGuard)
  async delete(@Request() req: IRequest) {
    const withdrawalRequest = await this.transactionService.find({
      type: TRANSACTION_TYPES.BALANCE_TO_BANK,
      status: TRANSACTION_STATUS.PENDING,
      bank_id: req.bank.id,
    });

    if (withdrawalRequest) {
      throw new BadRequestException(
        'You have a pending withdrawal request linked to this bank',
      );
    }

    await this.bankService.delete(req.bank.id);
    return { message: 'Bank deleted successfully' };
  }
}
