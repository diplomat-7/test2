import { Type } from 'class-transformer';
import {
  IsIn,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { BANK_STATUS } from './banks.constants';

export class CreateBankDTO {
  @IsString()
  @IsNotEmpty()
  account_name: string;

  @IsString()
  @IsNotEmpty()
  bank_city: string;

  @IsString()
  @IsNotEmpty()
  bank_name: string;

  @IsString()
  @IsNotEmpty()
  iban: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  documentId: number;
}
export class UpdateBankDTO {
  @IsString()
  @IsOptional()
  account_name: string;

  @IsString()
  @IsOptional()
  bank_city: string;

  @IsString()
  @IsOptional()
  bank_name: string;

  @IsString()
  @IsOptional()
  iban: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  documentId: number;
}

export class ApproveBankDTO {
  @IsIn([BANK_STATUS.APPROVED, BANK_STATUS.DECLINED])
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  decline_message: string;
}
