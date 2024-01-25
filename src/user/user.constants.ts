import { TUserKeys } from './user.interface';

export enum USER_TYPE {
  A1 = 'A1',
  A2 = 'A2',
  A3 = 'A3',
  ADMINS = 'ADMINS',
  SUPPLIER = 'SUPPLIER',
  SUBCONTRACTOR = 'SUBCONTRACTOR',
}
export enum USER_STATUS {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export const USER_ATTRIBUTES: TUserKeys[] = [
  'id',
  'email',
  'phone',
  'status',
  'framer_id',
  'id_number',
  'user_type',
  'full_name',
  'date_of_birth',
  'email_verified',
];
