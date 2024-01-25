import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'vibans' })
export class Viban extends Model<Viban> {
  @Column({
    allowNull: false,
  })
  viban: string;

  @Column({
    defaultValue: false,
  })
  used: boolean;
}
