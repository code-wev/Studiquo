import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class AdminOverViewQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;
}
