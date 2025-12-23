// dto/availability.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { TimeSlotType } from '../../models/TimeSlot.model';
import { TutorSubject } from '../../models/TutorProfile.model';

export class CreateAvailabilityDto {
  @IsDateString(
    {},
    { message: 'Date must be a valid ISO date string (e.g., 2025-12-14)' },
  )
  @IsNotEmpty({ message: 'Date is required' })
  date: string; // YYYY-MM-DD
}

export class CreateTimeSlotDto {
  @IsDateString(
    {},
    { message: 'startTime must be a valid ISO datetime string' },
  )
  @IsNotEmpty({ message: 'startTime is required' })
  startTime: string;

  @IsDateString({}, { message: 'endTime must be a valid ISO datetime string' })
  @IsNotEmpty({ message: 'endTime is required' })
  endTime: string;

  @IsUrl({}, { message: 'meetLink must be a valid URL' })
  meetLink: string;

  @IsString({ message: 'Type must be a string' })
  @IsEnum(TimeSlotType, {
    message: 'Type must be ONE_TO_ONE or GROUP',
  })
  type: string;

  @IsString({ message: 'Subject must be a string' })
  @IsEnum(['MATH', 'SCIENCE', 'ENGLISH'], {
    message: 'Subject must be one of MATH|SCIENCE|ENGLISH',
  })
  subject: string;
}

export class UpdateTimeSlotDto {
  @IsDateString(
    {},
    { message: 'startTime must be a valid ISO datetime string' },
  )
  @IsNotEmpty({ message: 'startTime is required' })
  startTime: string;

  @IsDateString({}, { message: 'endTime must be a valid ISO datetime string' })
  @IsNotEmpty({ message: 'endTime is required' })
  endTime: string;

  @IsOptional()
  @IsUrl({}, { message: 'meetLink must be a valid URL' })
  meetLink?: string;

  @IsOptional()
  @IsBoolean({ message: 'isBooked must be a boolean' })
  isBooked?: boolean;

  @IsOptional()
  @IsString({ message: 'Type must be a string' })
  @IsEnum(TimeSlotType, {
    message: 'Type must be ONE_TO_ONE or GROUP',
  })
  type: string;

  @IsString({ message: 'Subject must be a string' })
  @IsEnum(TutorSubject, {
    message: 'Subject must be one of MATH|SCIENCE|ENGLISH',
  })
  subject: string;
}
