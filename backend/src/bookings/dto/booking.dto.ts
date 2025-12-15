import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString({ message: 'Time slot id must be a string' })
  @IsNotEmpty({ message: 'Time slot is required' })
  timeSlot: string;

  @IsString({ message: 'Subject must be a string' })
  @IsEnum(['MATH', 'SCIENCE', 'ENGLISH'], {
    message: 'Subject must be one of MATH|SCIENCE|ENGLISH',
  })
  subject: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Date is required and must be a valid date string' })
  date: string;

  @IsString({ message: 'Type must be a string' })
  @IsEnum(['ONE_TO_ONE', 'GROUP'], {
    message: 'Type must be ONE_TO_ONE or GROUP',
  })
  type: string;
}
