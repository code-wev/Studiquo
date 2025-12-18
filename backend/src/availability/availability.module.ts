import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'common/jwt.config';
import {
  TutorProfile,
  TutorProfileSchema,
} from 'src/models/tutorProfile.model';
import { TimeSlot, TimeSlotSchema } from '../models/timeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from '../models/tutorAvailability.model';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

/**
 * Availability feature module.
 *
 * Manages tutor availability dates and time slots. Exports the
 * `AvailabilityService` so other modules (for example `TutorsModule`)
 * can query availability.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TutorAvailability.name, schema: TutorAvailabilitySchema },
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
