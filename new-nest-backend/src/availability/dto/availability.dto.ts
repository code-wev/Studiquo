import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAvailabilityDto {
  @IsDateString()
  @IsNotEmpty({
    message: 'Date is required and must be a valid ISO date string',
  })
  date: string;
}

export class CreateTimeSlotDto {
  @IsDateString()
  @IsNotEmpty({
    message: 'Start time is required and must be a valid ISO date string',
  })
  startTime: string;

  @IsDateString()
  @IsNotEmpty({
    message: 'End time is required and must be a valid ISO date string',
  })
  endTime: string;

  @IsOptional()
  @IsString({ message: 'Meet link must be a string' })
  meetLink?: string;
}

export class UpdateTimeSlotDto {
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsOptional()
  @IsString({ message: 'Meet link must be a string' })
  meetLink?: string;

  @IsOptional()
  @IsBoolean({ message: 'isBooked must be a boolean' })
  isBooked?: boolean;
}
