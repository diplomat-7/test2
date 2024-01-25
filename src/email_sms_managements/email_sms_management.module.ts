import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CommonsModule } from 'src/commons/commons.module';
import { EmailAndSmsManagement } from './email_sms_management.model';
import { EmailAndSmsManagementService } from './email_sms_management.service';

@Module({
  controllers: [],
  providers: [EmailAndSmsManagementService],
  exports: [EmailAndSmsManagementService],
  imports: [SequelizeModule.forFeature([EmailAndSmsManagement]), CommonsModule],
})
export class EmailAndSmsManagementModule {}
