import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
  HasMany,
  DataType,
} from 'sequelize-typescript';

import { Wallet } from 'src/wallets/wallets.model';
import { Company } from 'src/company/company.model';
import { Transaction } from 'src/transactions/transactions.model';

@Table({ tableName: 'balances' })
export class Balance extends Model {
  @Column({ defaultValue: 0, type: DataType.DECIMAL })
  total_amount: number;

  @Column({ defaultValue: 0, type: DataType.DECIMAL })
  allocated_amount: number;

  @Column
  iban: string;

  @Column(DataType.VIRTUAL)
  get remaining_balance(): number {
    return this.total_amount - this.allocated_amount;
  }

  @ForeignKey(() => Company)
  @Column
  company_id: number;

  // Associations
  @BelongsTo(() => Company)
  company: Company;

  @HasMany(() => Wallet)
  wallets: Wallet;

  @HasMany(() => Transaction)
  transactions: Transaction;
}
