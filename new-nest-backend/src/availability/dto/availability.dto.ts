import { IsDateString, IsOptional } from 'class-validator';

export class CreateAvailabilityDto {
  @IsDateString()
  date: string;
}

export class CreateTimeSlotDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
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
  meetLink?: string;

  @IsOptional()
  isBooked?: boolean;
}
