import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'common/jwt.config';
import { TimeSlot, TimeSlotSchema } from 'src/models/timeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from 'src/models/tutorAvailability.model';
import {
  TutorProfile,
  TutorProfileSchema,
} from 'src/models/tutorProfile.model';
import { User, UserSchema } from 'src/models/user.model';
import { PaymentsModule } from 'src/payments/payments.module';
import { Booking, BookingSchema } from '../models/booking.model';
import {
  BookingStudents,
  BookingStudentsSchema,
} from '../models/bookingStudents.model';
import { LessonReport, LessonReportSchema } from '../models/lessonReport.model';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { ParentBookingsController } from './parent-bookings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: BookingStudents.name, schema: BookingStudentsSchema },
      { name: LessonReport.name, schema: LessonReportSchema },
      { name: TimeSlot.name, schema: TimeSlotSchema },
      { name: TutorAvailability.name, schema: TutorAvailabilitySchema },
      { name: TutorProfile.name, schema: TutorProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register(jwtConfig),
    // PaymentsModule provides PaymentsService used during booking creation
    PaymentsModule,
  ],
  controllers: [BookingsController, ParentBookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
