import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

// Extend PaginationDto to include search functionality
export class searchPaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
