import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Wallet } from './wallets.model';
import { WalletsController } from './wallets.controller';

import { WalletsService } from './wallets.service';

import { CommonsModule } from 'src/commons/commons.module';
import { BalanceModule } from 'src/balance/balance.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  providers: [WalletsService],
  controllers: [WalletsController],
  imports: [
    CommonsModule,
    BalanceModule,
    TransactionsModule,
    SequelizeModule.forFeature([Wallet]),
  ],
})
export class WalletsModule {}
