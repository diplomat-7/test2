import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CompanyListDTO {
  @IsString()
  @IsOptional()
  search_query: string;

  @IsString()
  @IsOptional()
  company_name: string;

  @IsString()
  @IsOptional()
  cr_number: string;
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
