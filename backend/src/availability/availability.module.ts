import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../common/jwt.config';
import { Booking, BookingSchema } from '../models/Booking.model';
import { TimeSlot, TimeSlotSchema } from '../models/TimeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from '../models/TutorAvailability.model';
import { TutorProfile, TutorProfileSchema } from '../models/TutorProfile.model';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

/**
 * Availability feature module.
 *
 * Registers the `TutorAvailability`, `TimeSlot`, and `TutorProfile` schemas and
 * exposes the `AvailabilityService` and `AvailabilityController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TutorAvailability.name, schema: TutorAvailabilitySchema },
      { name: Booking.name, schema: BookingSchema },
      { name: TimeSlot.name, schema: TimeSlotSchema },
      { name: TutorProfile.name, schema: TutorProfileSchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
