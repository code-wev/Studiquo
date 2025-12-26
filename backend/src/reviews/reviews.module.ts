import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../common/jwt.config';
import { Booking, BookingSchema } from '../models/Booking.model';
import {
  BookingStudents,
  BookingStudentsSchema,
} from '../models/BookingStudents.model';
import { Review, ReviewSchema } from '../models/Review.model';
import { TimeSlot, TimeSlotSchema } from '../models/TimeSlot.model';
import {
  TutorAvailability,
  TutorAvailabilitySchema,
} from '../models/TutorAvailability.model';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

/**
 * Reviews feature module.
 *
 * Registers the `Review` schema and
 * exposes the `ReviewsService` and `ReviewsController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: BookingStudents.name, schema: BookingStudentsSchema },
      { name: TimeSlot.name, schema: TimeSlotSchema },
      { name: TutorAvailability.name, schema: TutorAvailabilitySchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
