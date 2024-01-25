import {
  Table,
  Column,
  Model,
  DeletedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Company } from 'src/company/company.model';

@Table({ paranoid: true, tableName: 'sub_users' })
export class SubUser extends Model<SubUser> {
  @Column({
    unique: true,
    allowNull: false,
  })
  phone: string;

  @Column({
    defaultValue: false,
  })
  disabled: boolean;

  @Column
  title: string;

  @Column
  framer_id: string;

  @DeletedAt
  deletedAt: Date;

  @ForeignKey(() => Company)
  @Column
  company_id: number;

  // Associations
  @BelongsTo(() => Company)
  company: Company;
}
