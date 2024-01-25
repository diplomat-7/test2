import { Type } from 'class-transformer';
import {
  IsIn,
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from 'src/transactions/transactions.constants';

export class BalanceChargeDTO {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @IsIn([TRANSACTION_TYPES.BALANCE_TO_BANK, TRANSACTION_TYPES.BANK_TO_BALANCE])
  @IsString()
  @IsNotEmpty()
  transaction_type: string;
}
export class BalanceTxnListDTO {
  @IsIn(Object.values(TRANSACTION_TYPES))
  @IsString()
  @IsOptional()
  type: string;

  @IsIn(Object.values(TRANSACTION_STATUS))
  @IsString()
  @IsOptional()
  status: string;
}
