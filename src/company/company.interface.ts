import { User } from 'src/user/user.model';
import { Document } from 'src/document/document.model';

export interface ICompany {
  id?: number;
  cr_city?: string;
  vat_number?: string;
  cr_number?: string;
  framer_id?: string;
  company_name?: string;
  kyc_verified?: boolean;
  cr_expiry_date?: string;
  cr_creation_date?: string;
  vat_cert_accepted?: boolean;
  company_legal_name?: string;
  kyc_verification_code?: string;
  kyc_verifier?: Record<string, any>;
  user?: User;
  documents?: Document[];
  auth_letter_accepted?: boolean;
}
export interface ICompanyId {
  id: number;
}
