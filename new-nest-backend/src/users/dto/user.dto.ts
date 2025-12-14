import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
  // User fields
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar link must be a valid URL' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'DBS must be a string' })
  dbsLink?: string;

  // Tutor fields
  @IsOptional()
  @IsString({ message: 'Subject must be a string' })
  @IsEnum(['MATH', 'SCIENCE', 'ENGLISH'], {
    message: 'Subject must be one of MATH|SCIENCE|ENGLISH',
  })
  subject?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Hourly rate must be a number' })
  hourlyRate?: number;

  // Student fields
  @IsOptional()
  @IsString({ message: 'Year group must be a string' })
  yearGroup?: string;

  @IsOptional()
  @IsString({ message: 'Confidence level must be a string' })
  confidenceLevel?: string;

  @IsOptional()
  @IsString({ message: 'Current grade must be a string' })
  currentGrade?: string;

  @IsOptional()
  @IsString({ message: 'Target grade must be a string' })
  targetGrade?: string;
}
