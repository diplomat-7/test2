import { ICompany } from './company.interface';

export type TCompanyKeys = keyof ICompany;
export const COMPANY_ATTRIBUTES: TCompanyKeys[] = [
  'id',
  'cr_city',
  'framer_id',
  'cr_number',
  'vat_number',
  'company_name',
  'kyc_verified',
  'kyc_verifier',
  'cr_expiry_date',
  'cr_creation_date',
  'vat_cert_accepted',
  'company_legal_name',
  'auth_letter_accepted',
];
