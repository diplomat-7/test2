import {
  Table,
  Model,
  Column,
  HasMany,
  DeletedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { BANK_STATUS } from './banks.constants';
import { Company } from 'src/company/company.model';
import { Document } from 'src/document/document.model';

@Table({ tableName: 'banks', paranoid: true })
export class Bank extends Model {
  @Column({ allowNull: false })
  account_name: string;

  @Column({ allowNull: false })
  bank_name: string;

  @Column({ allowNull: false })
  bank_city: string;

  @Column({ allowNull: false })
  iban: string;

  @Column({ defaultValue: false })
  is_default: boolean;

  @Column({ defaultValue: BANK_STATUS.PENDING })
  status: string;

  @DeletedAt
  deletedAt: Date;

  @Column
  framer_id: string;

  @ForeignKey(() => Company)
  @Column({ allowNull: false })
  company_id: number;

  // Associations
  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Document)
  documents: Document;
}
