import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TaskService } from './tasks.service';
import { CommonsModule } from 'src/commons/commons.module';
import { EmailAndSmsManagementModule } from 'src/email_sms_managements/email_sms_management.module';

@Module({
  controllers: [],
  providers: [TaskService],
  imports: [SequelizeModule, CommonsModule, EmailAndSmsManagementModule],
})
export class TaskModule {}
