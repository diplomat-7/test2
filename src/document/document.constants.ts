import { IDocument } from './document.interface';

export enum DOCUMENT_STATUS {
  NEW = 'NEW',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
}
export enum DOCUMENT_LANG_TYPE {
  EN = 'EN',
  AR = 'AR',
}
export enum DOCUMENT_TYPES {
  VATCERT = 'VATCERT',
  AUTHLETTER = 'AUTHLETTER',
  BANK_RECEIPT = 'BANK_RECEIPT',
  DEPOSIT_RECEIPT = 'DEPOSIT_RECEIPT',
}
export const FILE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.mp4',
  '.mp3',
  '.zip',
  '.rar',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.json',
  '.txt',
  '.csv',
];

type TDocumentKeys = keyof IDocument;
export const DOCUMENT_ATTRIBUTES: TDocumentKeys[] = [
  'id',
  'link',
  'type',
  'name',
  'framer_id',
  'lang_type',
];
