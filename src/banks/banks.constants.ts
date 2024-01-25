import { IBank } from './banks.interface';

export enum BANK_STATUS {
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  APPROVED = 'APPROVED',
}

type TBankKeys = keyof IBank;
export const BANK_ATTRIBUTES: TBankKeys[] = [
  'id',
  'iban',
  'status',
  'bank_name',
  'bank_city',
  'company_id',
  'account_name',
];
