import {
  IsIn,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { DOCUMENT_STATUS, DOCUMENT_TYPES } from './document.constants';

export class FileUploadDTO {
  @IsIn(Object.values(DOCUMENT_TYPES))
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsOptional()
  isPublic: boolean;

  @IsString()
  @IsOptional()
  docNumber: string;

  @IsString()
  @IsOptional()
  lang_type: string;
}
export class AdminAcceptUserDocumentDTO {
  @IsIn([DOCUMENT_STATUS.APPROVED, DOCUMENT_STATUS.DECLINED])
  @IsString()
  status: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  documentId: number;
}
