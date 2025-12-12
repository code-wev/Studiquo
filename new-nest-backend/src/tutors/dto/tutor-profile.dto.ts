import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTutorProfileDto {
  @IsArray()
  @IsString({ each: true, message: 'Each subject must be a string' })
  subjects: string[];

  @IsNumber({}, { message: 'Hourly rate must be a number' })
  hourlyRate: number;

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  rating?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total reviews must be a number' })
  totalReviews?: number;
}

export class UpdateTutorProfileDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each subject must be a string' })
  subjects?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Hourly rate must be a number' })
  hourlyRate?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  rating?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total reviews must be a number' })
  totalReviews?: number;
}
