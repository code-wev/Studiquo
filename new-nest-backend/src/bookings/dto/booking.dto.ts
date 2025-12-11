import { IsDateString, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  timeSlot: string;

  @IsString()
  subject: string;

  @IsDateString()
  date: string;
}

export class UpdateBookingStatusDto {
  @IsString()
  status: string;
}
