import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailabilityModule } from 'src/availability/availability.module';
import { jwtConfig } from 'src/common/jwt.config';
import { Booking, BookingSchema } from 'src/models/booking.model';
import { Payment, PaymentSchema } from 'src/models/payment.model';
import { Payout, PayoutSchema } from 'src/models/payout.model';
import { Review, ReviewSchema } from 'src/models/review.model';
import { TimeSlot, TimeSlotSchema } from 'src/models/timeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from 'src/models/tutorAvailability.model';
import { TutorProfile, TutorProfileSchema } from '../models/tutorProfile.model';
import { User, UserSchema } from '../models/user.model';
import { TutorsController } from './tutors.controller';
import { TutorsService } from './tutors.service';

/**
 * Tutors feature module.
 *
 * Registers the `TutorProfile`, `User` and `Review` schemas and
 * exposes the `TutorsService` and `TutorsController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TutorProfile.name, schema: TutorProfileSchema },
      { name: User.name, schema: UserSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Payout.name, schema: PayoutSchema },
      { name: TimeSlot.name, schema: TimeSlotSchema },
      { name: TutorAvailability.name, schema: TutorAvailabilitySchema },
    ]),
    AvailabilityModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [TutorsController],
  providers: [TutorsService],
  exports: [TutorsService],
})
export class TutorsModule {}
