import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../models/booking.model';
import { Payment, PaymentSchema } from '../models/payment.model';
import { Payout, PayoutSchema } from '../models/payout.model';
import { TutorProfile, TutorProfileSchema } from '../models/tutorProfile.model';
import { User, UserSchema } from '../models/user.model';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Payout.name, schema: PayoutSchema },
      { name: TutorProfile.name, schema: TutorProfileSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
