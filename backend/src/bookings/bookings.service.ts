import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../models/booking.model';
import { BookingStudents } from '../models/bookingStudents.model';
import { LessonReport } from '../models/lessonReport.model';
import { CreateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(BookingStudents.name)
    private bookingStudentsModel: Model<BookingStudents>,
    @InjectModel(LessonReport.name)
    private lessonReportModel: Model<LessonReport>,
  ) {}

  async createBooking(user: any, dto: CreateBookingDto) {
    const booking = new this.bookingModel({ ...dto, status: 'SCHEDULED' });
    await booking.save();
    const bookingStudent = new this.bookingStudentsModel({
      booking: booking._id,
      student: user.userId,
    });
    await bookingStudent.save();
    // Optionally create a lesson report for this booking
    await this.lessonReportModel.create({
      booking: booking._id,
      description: '',
      dueDate: new Date(),
      submitted: false,
    });
    return booking;
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return this.bookingModel.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true },
    );
  }

  async getMyBookings(user: any) {
    const bookings = await this.bookingStudentsModel
      .find({ student: user.userId })
      .populate('booking');
    return bookings.map((b) => b.booking);
  }

  async getMySchedule(user: any) {
    // Find bookings where user is tutor (stub)
    return [];
  }

  async getBookingDetails(bookingId: string) {
    return this.bookingModel.findById(bookingId);
  }
}
