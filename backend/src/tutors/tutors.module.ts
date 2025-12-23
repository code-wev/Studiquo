import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../common/jwt.config';
import { AvailabilityModule } from '../availability/availability.module';
import { Booking, BookingSchema } from '../models/Booking.model';
import { Payment, PaymentSchema } from '../models/Payment.model';
import { Payout, PayoutSchema } from '../models/Payout.model';
import { Review, ReviewSchema } from '../models/Review.model';
import { TimeSlot, TimeSlotSchema } from '../models/TimeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from '../models/TutorAvailability.model';
import { TutorProfile, TutorProfileSchema } from '../models/TutorProfile.model';
import { User, UserSchema } from '../models/User.model';
import { Wallet, WalletSchema } from '../models/Wallet.model';
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
