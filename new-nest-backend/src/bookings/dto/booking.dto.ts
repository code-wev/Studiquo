import { IsDateString, IsEnum, IsMongoId, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsMongoId()
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

export class UpdateBookingStatusDto {
  @IsString()
  status: string;
}
