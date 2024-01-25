import { Bank } from 'src/banks/banks.model';
import { Balance } from 'src/balance/balance.model';
import { Wallet } from 'src/wallets/wallets.model';

export interface ITransaction {
  id?: number;
  bank?: Bank;
  type?: string;
  status?: string;
  amount?: number;
  wallet?: Wallet;
  balance?: Balance;
  bank_id?: number;
  framer_id?: string;
  wallet_id?: number;
  balance_id?: number;
  approved?: boolean;
  document_id?: number;
}
