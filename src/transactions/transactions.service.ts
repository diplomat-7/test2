import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, Transaction as T } from 'sequelize';

import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from './transactions.constants';

import { IBalance } from 'src/balance/balance.interface';
import { ITransaction } from './transactions.interface';

import { Transaction } from './transactions.model';
import { Balance } from 'src/balance/balance.model';
import { Wallet } from 'src/wallets/wallets.model';
import { Document } from 'src/document/document.model';

import { CommonsService } from 'src/commons/commons.service';

interface ICountWithOptions {
  rows: Transaction[];
  count: number;
}
@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction)
    private readonly trxnRepository: typeof Transaction,
    private commonsService: CommonsService,
  ) {}

  async create(data: ITransaction, transaction?: T): Promise<Transaction> {
    data.framer_id = this.commonsService.generateFramerId('T');
    return this.trxnRepository.create<Transaction>(
      { ...data },
      { transaction },
    );
  }

  async update(
    data: ITransaction,
    transactionId: number,
    transaction?: T,
  ): Promise<void> {
    await this.trxnRepository.update<Transaction>(data, {
      where: { id: transactionId },
      transaction,
    });
  }

  async load(id: number): Promise<Transaction> {
    return this.trxnRepository.findByPk<Transaction>(id);
  }

  async list(data: ITransaction = {}): Promise<Transaction[]> {
    return this.trxnRepository.findAll<Transaction>({
      where: { ...data },
      include: [{ model: Document }, { model: Balance }, { model: Wallet }],
    });
  }

  async search(options: FindAndCountOptions): Promise<ICountWithOptions> {
    return this.trxnRepository.findAndCountAll<Transaction>(options);
  }

  async find(data: ITransaction): Promise<Transaction> {
    return this.trxnRepository.findOne<Transaction>({ where: { ...data } });
  }

  async withdrawalRequestCheck(
    amount: number,
    balance: IBalance,
  ): Promise<void> {
    const pendingWithdrawalRequest =
      await this.trxnRepository.findOne<Transaction>({
        where: {
          status: TRANSACTION_STATUS.PENDING,
          type: TRANSACTION_TYPES.BALANCE_TO_BANK,
        },
      });

    if (pendingWithdrawalRequest) {
      throw new BadRequestException('You have a pending withdrawal request');
    }

    if (Number(balance.total_amount) - amount < 0) {
      throw new BadRequestException('Insufficient amount for withdrawal');
    }
  }
}
