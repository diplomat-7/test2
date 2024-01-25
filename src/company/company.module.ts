import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Company } from './company.model';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

import { UserModule } from 'src/user/user.module';
import { WathqModule } from 'src/wathq/wathq.module';
import { CommonsModule } from 'src/commons/commons.module';
import { VibanModule } from 'src/viban/viban.module';
import { BalanceModule } from 'src/balance/balance.module';
import { DocumentModule } from 'src/document/document.module';

@Module({
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
  imports: [
    SequelizeModule.forFeature([Company]),
    forwardRef(() => UserModule),
    WathqModule,
    CommonsModule,
    VibanModule,
    BalanceModule,
    DocumentModule,
  ],
})
export class CompanyModule {}
