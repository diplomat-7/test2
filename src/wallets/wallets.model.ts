import {
  Table,
  Model,
  Column,
  DataType,
  DeletedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { Balance } from 'src/balance/balance.model';

@Table({ tableName: 'wallets' })
export class Wallet extends Model {
  @Column({ defaultValue: 0, type: DataType.DECIMAL })
  allocated_amount: number;

  @Column({ defaultValue: 0, type: DataType.DECIMAL })
  amount_used: number;

  @Column({ allowNull: false })
  name: string;

  @Column
  framer_id: string;

  @Column({ type: DataType.VIRTUAL })
  get remaining_balance(): number {
    return this.allocated_amount - this.amount_used;
  }

  @Column({ type: DataType.VIRTUAL })
  get used_percentage(): number {
    const used = this.amount_used;
    const amount = this.allocated_amount;
    const percentage = (used / amount) * 100;
    return percentage > 100 ? 100 : 0;
  }

  @DeletedAt
  deletedAt: Date;

  @ForeignKey(() => Balance)
  @Column
  balance_id: number;

  // Associations
  @BelongsTo(() => Balance)
  balance: Balance;
}
