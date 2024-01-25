import { Transaction } from 'sequelize';
import { Balance } from 'src/balance/balance.model';

export interface IWallet {
  id?: number;
  name?: string;
  balance?: Balance;
  framer_id?: string;
  balance_id?: number;
  amount_used?: number;
  allocated_amount?: number;
  remaining_balance?: number;
  allocated_percentage?: number;
}
export type TWalletChargeData = {
  amount: number;
  wallet: IWallet;
  transaction?: Transaction;
};
