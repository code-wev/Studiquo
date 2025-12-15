import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from 'src/common/jwt.config';
import { Booking, BookingSchema } from '../models/booking.model';
import {
  BookingStudents,
  BookingStudentsSchema,
} from '../models/bookingStudents.model';
import { LessonReport, LessonReportSchema } from '../models/lessonReport.model';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: BookingStudents.name, schema: BookingStudentsSchema },
      { name: LessonReport.name, schema: LessonReportSchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
