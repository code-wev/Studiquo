import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Refund, RefundSchema } from 'src/models/Refund.model';
import { Booking, BookingSchema } from '../models/Booking.model';
import { Payment, PaymentSchema } from '../models/Payment.model';
import { Payout, PayoutSchema } from '../models/Payout.model';
import { TutorProfile, TutorProfileSchema } from '../models/TutorProfile.model';
import { User, UserSchema } from '../models/User.model';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

/**
 * Admin feature module.
 *
 * Registers the `User`, `Booking`, `Payment`, `Payout`, and `TutorProfile` schemas and
 * exposes the `AdminService` and `AdminController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Payout.name, schema: PayoutSchema },
      { name: TutorProfile.name, schema: TutorProfileSchema },
      { name: Refund.name, schema: RefundSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
