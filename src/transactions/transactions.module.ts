import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Transaction } from './transactions.model';

import { BanksModule } from 'src/banks/banks.module';
import { CommonsModule } from 'src/commons/commons.module';
import { DocumentModule } from 'src/document/document.module';

import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';

@Module({
  providers: [TransactionsService],
  exports: [TransactionsService],
  imports: [
    CommonsModule,
    DocumentModule,
    forwardRef(() => BanksModule),
    SequelizeModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
