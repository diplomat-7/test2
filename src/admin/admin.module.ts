import { Module } from '@nestjs/common';

import { AdminUsersController } from './admin.users.controller';
import { AdminBanksController } from './admin.banks.controller';
import { AdminTransactionsController } from './admin.transactions.controller';

import { BanksModule } from 'src/banks/banks.module';
import { CompanyModule } from 'src/company/company.module';
import { BalanceModule } from 'src/balance/balance.module';
import { DocumentModule } from 'src/document/document.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  controllers: [
    AdminUsersController,
    AdminBanksController,
    AdminTransactionsController,
  ],
  imports: [
    BanksModule,
    BalanceModule,
    CompanyModule,
    DocumentModule,
    TransactionsModule,
  ],
})
export class AdminModule {}
