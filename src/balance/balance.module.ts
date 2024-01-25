import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Balance } from './balance.model';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  exports: [BalanceService],
  providers: [BalanceService],
  controllers: [BalanceController],
  imports: [TransactionsModule, SequelizeModule.forFeature([Balance])],
})
export class BalanceModule {}
