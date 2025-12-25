import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TutorSubject } from '../../models/TutorProfile.model';

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
  @IsString({ message: 'DBS must be a string' })
  dbsLink?: string;

  // Tutor fields
  @IsOptional()
  @IsArray({ message: 'Subjects must be an array' })
  @IsEnum(TutorSubject, {
    each: true,
    message: 'Each subject must be one of MATH, SCIENCE, ENGLISH',
  })
  subjects?: string[];

  @IsOptional()
  @IsNumber({}, { message: 'Group hourly rate must be a number' })
  groupHourlyRate?: number;

  @IsOptional()
  @IsNumber({}, { message: 'One-on-one hourly rate must be a number' })
  oneOnOneHourlyRate?: number;
}

export class RespondToParentRequestDto {
  @IsNotEmpty()
  @IsIn([true, false], {
    message: 'Accept must be a boolean value',
  })
  accept: boolean;
}
