import { Table, Column, Model } from 'sequelize-typescript';
import { EMAIL_SMS_TYPE } from './email_sms_management.constants';

@Table({ tableName: 'email_sms_managements' })
export class EmailAndSmsManagement extends Model<EmailAndSmsManagement> {
  @Column({
    defaultValue: EMAIL_SMS_TYPE.EMAIL,
  })
  type: string;

  @Column({
    allowNull: false,
  })
  receiver: string;

  @Column({
    defaultValue: 0,
  })
  retry_count: number;

  @Column({
    allowNull: false,
  })
  body: string;

  @Column
  template: string;

  @Column
  sent_at: Date;

  @Column
  subject: string;

  @Column
  sender: string;
}
