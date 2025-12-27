import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

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

export class ChangeRefundStatusDto {
  @IsEnum(['APPROVED', 'COMPLETED', 'REJECTED'], {
    message: 'status must be APPROVED, COMPLETED, or REJECTED',
  })
  status: 'APPROVED' | 'COMPLETED' | 'REJECTED';
}
