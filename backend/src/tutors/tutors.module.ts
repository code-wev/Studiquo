import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'common/jwt.config';
import { AvailabilityModule } from 'src/availability/availability.module';
import { Booking, BookingSchema } from 'src/models/Booking.model';
import { Payment, PaymentSchema } from 'src/models/Payment.model';
import { Payout, PayoutSchema } from 'src/models/Payout.model';
import { Review, ReviewSchema } from 'src/models/Review.model';
import { TimeSlot, TimeSlotSchema } from 'src/models/TimeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from 'src/models/TutorAvailability.model';
import { Wallet, WalletSchema } from 'src/models/Wallet.model';
import { TutorProfile, TutorProfileSchema } from '../models/TutorProfile.model';
import { User, UserSchema } from '../models/User.model';
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
      { name: Wallet.name, schema: WalletSchema },
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
