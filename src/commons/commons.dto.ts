import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class QueryDTO {
  @IsString()
  @IsOptional()
  search_query: string;

  @Type(() => Number)
  @IsNumber()
  limit: number = 100;

  @Type(() => Number)
  @IsNumber()
  offset: number = 0;
}
