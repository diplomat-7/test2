import {
  IsIn,
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} from './transactions.constants';
import { Type } from 'class-transformer';
import { QueryDTO } from 'src/commons/commons.dto';

export class DepositTxnDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  documentId: number;
}
export class WithdrawalTxnDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  bankId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
export class TxnListDtO extends QueryDTO {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  balance_id: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  approved: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  wallet_id: number;

  @IsIn(Object.values(TRANSACTION_STATUS))
  @IsString()
  @IsOptional()
  status: string;

  @IsIn(Object.values(TRANSACTION_TYPES))
  @IsString()
  @IsOptional()
  type: string;
}
export class ApproveTxnDTO {
  @IsIn([
    TRANSACTION_STATUS.DONE,
    TRANSACTION_STATUS.CANCELED,
    TRANSACTION_STATUS.DECLINED,
  ])
  @IsString()
  @IsNotEmpty()
  status: string;

  @ValidateIf(
    (data) =>
      data.type === TRANSACTION_TYPES.BANK_TO_BALANCE &&
      data.status === TRANSACTION_STATUS.DONE,
  )
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsIn([TRANSACTION_TYPES.BALANCE_TO_BANK, TRANSACTION_TYPES.BANK_TO_BALANCE])
  @IsString()
  @IsNotEmpty()
  type: string;
}
