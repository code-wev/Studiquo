import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTutorProfileDto {
  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @IsNumber()
  hourlyRate: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  totalReviews?: number;
}

export class UpdateTutorProfileDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  totalReviews?: number;
}
