import { Type } from 'class-transformer';
import {
  IsIn,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from 'src/transactions/transactions.constants';

export class CreateWalletDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
export class WalletUpdateDTO {
  @IsString()
  @IsOptional()
  name: string;
}
export class WalletChargeDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsIn([
    TRANSACTION_TYPES.BALANCE_TO_WALLET,
    TRANSACTION_TYPES.WALLET_TO_BALANCE,
  ])
  @IsString()
  @IsNotEmpty()
  readonly transaction_type: string;
}
export class WalletTxnListDTO {
  @IsIn([
    TRANSACTION_TYPES.BALANCE_TO_WALLET,
    TRANSACTION_TYPES.WALLET_TO_BALANCE,
  ])
  @IsString()
  @IsOptional()
  type: string;

  @IsIn(Object.values(TRANSACTION_STATUS))
  @IsString()
  @IsOptional()
  status: string;
}
