import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { EMAIL_SMS_TYPE } from 'src/email_sms_managements/email_sms_management.constants';
import { IEmailSmsManagement } from 'src/email_sms_managements/email_sms_management.interface';
import { EmailAndSmsManagementService } from 'src/email_sms_managements/email_sms_management.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private sequelize: Sequelize,
    private readonly emailSmsService: EmailAndSmsManagementService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleEmailSmsBroadCast(): Promise<any> {
    this.logger.debug('Starting Email Sms Broadcasting job');

    const oldestPendingMessageArray: IEmailSmsManagement[] =
      await this.sequelize.query(
        `select * from email_sms_managements where sent_at is null and retry_count < 3 order by "createdAt" asc limit 1`,
        { type: QueryTypes.SELECT },
      );

    let messageSent = false;

    if (!oldestPendingMessageArray.length) return null;

    const oldestPendingMessage = oldestPendingMessageArray[0];

    const result = await this.emailSmsService.update(
      { sent_at: new Date() },
      { id: oldestPendingMessage.id, sent_at: null },
    );

    if (!result[0]) return null;

    if (oldestPendingMessage.type === EMAIL_SMS_TYPE.SMS) {
      try {
        const response = await this.emailSmsService.sendSMS(
          oldestPendingMessage.body,
          oldestPendingMessage.receiver,
        );
        if (response?.status === 200) messageSent = true;
      } catch (error) {
        this.logger.error('[Error Sending SMS]', error?.response?.data);
      }
    } else {
      try {
        const response = await this.emailSmsService.sendEmail({
          to: oldestPendingMessage.receiver,
          from: oldestPendingMessage.sender,
          replacements: oldestPendingMessage.body,
          subject: oldestPendingMessage.subject,
          template: oldestPendingMessage.template,
        });
        if (response?.accepted?.length) messageSent = true;
      } catch (error) {
        this.logger.error('[Error Sending Email]', error);
      }
    }

    if (messageSent) {
      this.logger.log('Job processed...');
    } else {
      await this.emailSmsService.update(
        {
          sent_at: null,
          retry_count: oldestPendingMessage.retry_count + 1,
        },
        { id: oldestPendingMessage.id },
      );
    }

    return oldestPendingMessage;
  }
}
