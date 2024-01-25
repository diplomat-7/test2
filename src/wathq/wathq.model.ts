import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'wathqs' })
export class Wathq extends Model<Wathq> {
  @Column(DataType.JSON)
  data: Record<string, any>;

  @Column
  cr_city: string;

  @Column({
    allowNull: false,
  })
  cr_number: string;

  @Column
  cr_expiry_date: string;

  @Column
  cr_creation_date: string;

  @Column
  company_legal_name: string;
}
