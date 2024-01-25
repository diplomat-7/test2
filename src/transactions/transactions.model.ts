import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
  HasMany,
  DataType,
} from 'sequelize-typescript';

import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from './transactions.constants';

import { Bank } from 'src/banks/banks.model';
import { Balance } from 'src/balance/balance.model';
import { Wallet } from 'src/wallets/wallets.model';
import { Document } from 'src/document/document.model';

@Table({ tableName: 'transactions' })
export class Transaction extends Model {
  @Column({ type: DataType.DECIMAL, defaultValue: 0, allowNull: false })
  amount: number;

  @Column({ defaultValue: TRANSACTION_TYPES.BALANCE_TO_WALLET })
  type: string;

  @Column({ defaultValue: TRANSACTION_STATUS.PENDING })
  status: string;

  @Column
  framer_id: string;

  @ForeignKey(() => Balance)
  @Column
  balance_id: number;

  @ForeignKey(() => Bank)
  @Column
  bank_id: number;

  @ForeignKey(() => Wallet)
  @Column
  wallet_id: number;

  @Column({ defaultValue: false })
  approved: boolean;

  // Associations
  @BelongsTo(() => Balance)
  balance: Balance;

  @BelongsTo(() => Bank)
  bank: Bank;

  @BelongsTo(() => Wallet)
  wallet: Wallet;

  @HasMany(() => Document)
  documents: Document;
}
