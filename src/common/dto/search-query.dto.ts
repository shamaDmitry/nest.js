import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from './base-query.dto';

export class SearchQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  // Allow dynamic field filters
  [key: string]: unknown;
}
