import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
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
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
