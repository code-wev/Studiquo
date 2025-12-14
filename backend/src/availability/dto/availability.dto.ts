// dto/availability.dto.ts
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
} from 'class-validator';

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
  @IsNotEmpty()
  startTime: string;

  @IsDateString({}, { message: 'endTime must be a valid ISO datetime string' })
  @IsNotEmpty()
  endTime: string;

  @IsOptional()
  @IsUrl({}, { message: 'meetLink must be a valid URL' })
  meetLink?: string;
}

export class UpdateTimeSlotDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'startTime must be a valid ISO datetime string' },
  )
  startTime?: string;

  @IsOptional()
  @IsDateString({}, { message: 'endTime must be a valid ISO datetime string' })
  endTime?: string;

  @IsOptional()
  @IsUrl({}, { message: 'meetLink must be a valid URL' })
  meetLink?: string;

  @IsOptional()
  @IsBoolean({ message: 'isBooked must be a boolean' })
  isBooked?: boolean;
}
