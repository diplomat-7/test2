import {
  IsIn,
  IsEmail,
  IsString,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

import { USER_STATUS } from './user.constants';
import { QueryDTO } from 'src/commons/commons.dto';

export class UpdateUserDTO {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  company_name: string;

  @IsString()
  @IsOptional()
  id_number: string;

  @IsString()
  @IsOptional()
  cr_number: string;

  @IsString()
  @IsOptional()
  date_of_birth: string;

  @IsString()
  @IsOptional()
  vat_number: string;

  @IsString()
  @IsOptional()
  full_name: string;

  @IsString()
  @IsOptional()
  kyc_otp: string;

  @ValidateIf((user) => user.cr_number != null)
  @IsString()
  @IsNotEmpty()
  cr_creation_date: string;

  @IsString()
  @IsOptional()
  email_otp: string;

  @IsString()
  @IsOptional()
  documentId: number;
}
export class UserListDTO extends QueryDTO {
  @IsIn(Object.values(USER_STATUS))
  @IsString()
  @IsOptional()
  status: string;
}
