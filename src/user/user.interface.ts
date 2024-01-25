import { Company } from 'src/company/company.model';

export interface IUser {
  id?: number;
  otp?: string;
  email?: string;
  phone?: string;
  status?: string;
  company?: Company;
  id_number?: string;
  user_type?: string;
  disabled?: boolean;
  full_name?: string;
  otp_sent_at?: Date;
  framer_id?: string;
  company_id?: number;
  date_of_birth?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  otp_secret_key?: string;
  kyc_completed?: boolean;
  email_verification_code?: string;
  kyc_step_one_completed?: boolean;
  kyc_step_two_completed?: boolean;
}

export type TUserKeys = keyof IUser;

export type TUpdateUserData = {
  user?: {
    full_name?: string;
    date_of_birth?: string;
  };
  company?: {
    cr_number?: string;
    vat_number?: string;
    company_name?: string;
    cr_creation_date?: string;
  };
};
