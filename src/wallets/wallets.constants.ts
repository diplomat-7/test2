import { IWallet } from './wallets.interface';

type TWalletModelKeys = keyof IWallet;
export const WALLET_ATTRIBUTES: TWalletModelKeys[] = [
  'id',
  'name',
  'framer_id',
  'amount_used',
  'allocated_amount',
  'remaining_balance',
  'allocated_percentage',
];
