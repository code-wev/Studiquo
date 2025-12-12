import { IsDateString, IsEnum, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  timeSlot: string;

  @IsString()
  @IsEnum(['MATH', 'SCIENCE', 'ENGLISH'])
  subject: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsEnum(['ONE_TO_ONE', 'GROUP'])
  type: string;
}