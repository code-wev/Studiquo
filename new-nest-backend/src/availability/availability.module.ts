import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'src/common/jwt.config';
import { TimeSlot, TimeSlotSchema } from '../models/timeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from '../models/tutorAvailability.model';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TutorAvailability.name, schema: TutorAvailabilitySchema },
      { name: TimeSlot.name, schema: TimeSlotSchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
