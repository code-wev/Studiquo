import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateProfileDto {
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
  @IsUrl({}, { message: 'DBS link must be a valid URL' })
  dbsLink?: string;

  @IsOptional()
  @IsString({ message: 'Subject must be a string' })
  @IsEnum(['MATH', 'SCIENCE', 'ENGLISH'], {
    message: 'Subject must be one of MATH|SCIENCE|ENGLISH',
  })
  subject?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Hourly rate must be a number' })
  hourlyRate?: number;
}
