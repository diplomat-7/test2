import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Bank } from './banks.model';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';

import { CommonsModule } from 'src/commons/commons.module';
import { DocumentModule } from 'src/document/document.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  exports: [BanksService],
  providers: [BanksService],
  controllers: [BanksController],
  imports: [
    CommonsModule,
    DocumentModule,
    SequelizeModule.forFeature([Bank]),
    forwardRef(() => TransactionsModule),
  ],
})
export class BanksModule {}
