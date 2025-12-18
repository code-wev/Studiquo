import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class TutorSearchQueryDto {
  @IsOptional()
  @IsString({ message: 'Subject must be a string' })
  @IsEnum(['MATH', 'SCIENCE', 'ENGLISH'], {
    message: 'Subject must be one of MATH | SCIENCE | ENGLISH',
  })
  subject?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Maximum hourly rate must be a number' })
  maxHourlyRate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Minimum tutor rating must be a number' })
  minRating?: number;

  @IsOptional()
  @IsString({ message: 'Search must be a string' })
  search?: string;
}
