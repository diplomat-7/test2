import {
  IsString,
  IsEmail,
  IsOptional,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

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
  @IsNotEmpty()
  @ValidateIf((user) => user.email != null)
  email_otp: string;
}
export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  phone: string;
}
export class VerifyOtpDTO {
  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}
export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsString()
  email: string;
}
export class AdminLoginDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
