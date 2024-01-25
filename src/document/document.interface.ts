import { Company } from 'src/company/company.model';
import { Bank } from 'src/banks/banks.model';
import { User } from '../user/user.model';
import { Transaction } from 'sequelize';

export interface IDocument {
  id?: number;
  link?: string;
  type?: string;
  name?: string;
  status?: string;
  framer_id?: string;
  lang_type?: string;
  issued_date?: Date;
  user_id?: number;
  user?: User;
  company_id?: number;
  company?: Company;
  bank_id?: number;
  bank?: Bank;
}
export interface IModelId {
  user_id: number;
  bank_id?: number;
  company_id?: number;
  transaction_id?: number;
}
export interface ITieDocumentModel {
  type?: string;
  data: IModelId;
  documentId: number;
  transaction?: Transaction;
}
