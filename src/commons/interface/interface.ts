import { Request } from 'express';
import { IUser } from 'src/user/user.interface';
import { IBank } from 'src/banks/banks.interface';
import { IWallet } from 'src/wallets/wallets.interface';
import { IBalance } from 'src/balance/balance.interface';
import { ICompany } from 'src/company/company.interface';
import { IDocument } from 'src/document/document.interface';
import { ITransaction } from 'src/transactions/transactions.interface';

export interface IJwtSign {
  userId: number;
  admin: boolean;
}
export interface IRequest extends Request {
  user: IUser;
  bank: IBank;
  profile: IUser;
  wallet: IWallet;
  balance: IBalance;
  company: ICompany;
  document: IDocument;
  transaction: ITransaction;
  companyProfile: ICompany;
}
export interface IAppConfig {
  unifonic: {
    baseUrl: string;
    appsId: string;
    senderId: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
  };
  jwt_secret: string;
  google: {
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
  admin: {
    email: string;
  };
  emailSender: string;
  elm: {
    ip: string;
    key: string;
  };
  wathq: {
    key: string;
    password: string;
    freeKeys: string;
    baseUrl: string;
  };
  storage: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
    publicBucket: string;
  };
}
