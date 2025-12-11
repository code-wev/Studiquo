import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../models/booking.model';
import {
  BookingStudents,
  BookingStudentsSchema,
} from '../models/bookingStudents.model';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { jwtConfig } from 'src/common/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: BookingStudents.name, schema: BookingStudentsSchema },
    ]),
   JwtModule.register(jwtConfig),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
