import {
  Table,
  Model,
  Column,
  HasOne,
  HasMany,
  DataType,
  DeletedAt,
} from 'sequelize-typescript';

import { User } from 'src/user/user.model';
import { Bank } from 'src/banks/banks.model';
import { Balance } from 'src/balance/balance.model';
import { Document } from 'src/document/document.model';

@Table({ tableName: 'companies' })
export class Company extends Model {
  @Column
  cr_creation_date: string;

  @Column
  cr_number: string;

  @Column
  cr_expiry_date: string;

  @Column
  cr_city: string;

  @Column
  company_legal_name: string;

  @Column
  vat_number: string;

  @Column({
    defaultValue: false,
  })
  kyc_verified: boolean;

  @Column(DataType.JSON)
  kyc_verifier: Record<string, any>;

  @Column
  company_name: string;

  @Column({
    defaultValue: false,
  })
  vat_cert_accepted: boolean;

  @Column({
    defaultValue: false,
  })
  auth_letter_accepted: boolean;

  @Column
  kyc_verification_code: string;

  @DeletedAt
  deletedAt: Date;

  @Column
  framer_id: string;

  // Associations
  @HasOne(() => User)
  user: User;

  @HasOne(() => Balance)
  balance: Balance;

  @HasMany(() => Bank)
  banks: Bank;

  @HasMany(() => Document)
  documents: Document[];
}
