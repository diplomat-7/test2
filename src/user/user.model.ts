import {
  Table,
  Column,
  Model,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { USER_STATUS, USER_TYPE } from './user.constants';
import { Company } from 'src/company/company.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column
  email: string;

  @Column({
    unique: true,
    allowNull: false,
  })
  phone: string;

  @Column({
    allowNull: false,
    defaultValue: USER_TYPE.SUBCONTRACTOR,
  })
  user_type: string;

  @Column({
    defaultValue: false,
  })
  email_verified: boolean;

  @Column({
    defaultValue: false,
  })
  kyc_step_one_completed: boolean;

  @Column({
    defaultValue: false,
  })
  kyc_step_two_completed: boolean;

  @Column({
    defaultValue: false,
  })
  phone_verified: boolean;

  @Column({
    defaultValue: false,
  })
  disabled: boolean;

  @Column({
    defaultValue: false,
  })
  kyc_completed: boolean;

  @Column({
    defaultValue: USER_STATUS.ACTIVE,
  })
  status: string;

  @Column
  framer_id: string;

  @Column
  hashed_password: string;

  @Column
  email_verification_code: string;

  @Column
  date_of_birth: string;

  @Column
  id_number: string;

  @Column
  otp: string;

  @Column
  otp_secret_key: string;

  @Column
  full_name: string;

  @Column
  otp_sent_at: Date;

  @DeletedAt
  deletedAt: Date;

  @ForeignKey(() => Company)
  @Column
  company_id: number;

  // Associations
  @BelongsTo(() => Company)
  company: Company;
}
