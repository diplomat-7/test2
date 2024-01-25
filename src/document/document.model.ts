import {
  Table,
  Model,
  Column,
  DeletedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { DOCUMENT_STATUS, DOCUMENT_LANG_TYPE } from './document.constants';

import { User } from 'src/user/user.model';
import { Bank } from 'src/banks/banks.model';
import { Company } from 'src/company/company.model';
import { Transaction } from 'src/transactions/transactions.model';

@Table({ tableName: 'documents', paranoid: true })
export class Document extends Model {
  @Column({ allowNull: false })
  link: string;

  @Column({ allowNull: false })
  type: string;

  @Column({ defaultValue: new Date() })
  issued_date: Date;

  @Column({ defaultValue: DOCUMENT_STATUS.NEW })
  status: string;

  @Column({ defaultValue: DOCUMENT_LANG_TYPE.EN })
  lang_type: string;

  @Column({ allowNull: false })
  name: string;

  @DeletedAt
  deletedAt: Date;

  @Column
  framer_id: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  user_id: number;

  @ForeignKey(() => Company)
  @Column
  company_id: number;

  @ForeignKey(() => Transaction)
  @Column
  transaction_id: number;

  @ForeignKey(() => Bank)
  @Column
  bank_id: number;

  // Associations
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Bank)
  bank: Bank;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsTo(() => Transaction)
  transaction: Transaction;
}
