import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TutorSubject } from 'src/models/TutorProfile.model';

export class TutorSearchPaginationDto {
  /* ---------- Search filters ---------- */

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(TutorSubject)
  subject?: TutorSubject;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @IsNumber()
  maxHourlyRate?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @IsNumber()
  minHourlyRate?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsString()
  search?: string;

  /* ---------- Pagination ---------- */

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number = 10;
}

export class PaymentRequestDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsOptional()
  @IsString({ message: 'Method must be a string' })
  method?: string;
}
