import { Transaction } from 'sequelize';
import { Company } from 'src/company/company.model';

export interface IBalance {
  id?: number;
  iban?: string;
  company?: Company;
  company_id?: number;
  total_amount?: number;
  allocated_amount?: number;
  remaining_balance?: number;
}
export type TBalanceChargeData = {
  amount: number;
  balance: IBalance;
  transaction?: Transaction;
};
export interface IBalanceId {
  id: number;
}
