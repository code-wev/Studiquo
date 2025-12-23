import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { TimeSlotType } from 'src/models/TimeSlot.model';
import { TutorSubject } from 'src/models/TutorProfile.model';

export class CreateBookingDto {
  @IsMongoId({ message: 'Tutor ID must be a valid Mongo ID' })
  @IsNotEmpty({ message: 'Time slot is required' })
  timeSlot: string;

  @IsString({ message: 'Subject must be a string' })
  @IsEnum(TutorSubject, {
    message: 'Subject must be one of MATH|SCIENCE|ENGLISH',
  })
  subject: string;

  @IsString({ message: 'Type must be a string' })
  @IsEnum(TimeSlotType, {
    message: 'Type must be ONE_TO_ONE or GROUP',
  })
  type: string;
}

export class CreatePaymentLinkDto {
  @IsMongoId({ message: 'Booking ID must be a valid Mongo ID' })
  @IsNotEmpty({ message: 'Booking ID is required' })
  bookingId: string;

  @IsMongoId({ message: 'Student ID must be a valid Mongo ID' })
  @IsNotEmpty({ message: 'Student ID is required' })
  studentId: string;
}
