import {
  IsArray,
  IsIn,
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
  @IsArray({ message: 'Subjects must be an array' })
  @IsIn(['MATH', 'SCIENCE', 'ENGLISH'], {
    each: true,
    message: 'Each subject must be one of MATH, SCIENCE, ENGLISH',
  })
  subjects?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Hourly rate must be a number' })
  hourlyRate?: number;
}
