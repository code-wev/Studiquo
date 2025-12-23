import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../common/jwt.config';
import { Booking, BookingSchema } from '../models/Booking.model';
import {
  BookingStudents,
  BookingStudentsSchema,
} from '../models/BookingStudents.model';
import { LessonReport, LessonReportSchema } from '../models/LessonReport.model';
import { TimeSlot, TimeSlotSchema } from '../models/TimeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from '../models/TutorAvailability.model';
import { TutorProfile, TutorProfileSchema } from '../models/TutorProfile.model';
import { User, UserSchema } from '../models/User.model';
import { PaymentsModule } from '../payments/payments.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

/**
 * Bookings feature module.
 *
 * Registers the `Booking`, `BookingStudents`, `LessonReport`, `TimeSlot`, `TutorAvailability`, `TutorProfile`, and `User` schemas and
 * exposes the `BookingsService` and `BookingsController` for the app.
 */
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
    PaymentsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
