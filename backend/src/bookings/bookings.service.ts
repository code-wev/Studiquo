import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimeSlot } from 'src/models/timeSlot.model';
import { TutorAvailability } from 'src/models/tutorAvailability.model';
import { TutorProfile } from 'src/models/tutorProfile.model';
import { PaymentsService } from 'src/payments/payments.service';
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
    @InjectModel(TimeSlot.name) private timeSlotModel: Model<TimeSlot>,
    @InjectModel(TutorAvailability.name)
    private availabilityModel: Model<TutorAvailability>,
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfile>,
    private paymentsService?: PaymentsService,
  ) {}

  async createBooking(user: any, dto: CreateBookingDto) {
    const booking = new this.bookingModel({ ...dto, status: 'PENDING' });
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

    // Create payment intent immediately if PaymentsService is available
    if (!this.paymentsService) {
      // PaymentsService not injected; return booking and let client create payment
      return { booking };
    }

    // Load timeslot and tutor info to compute amount
    const slot = await this.timeSlotModel.findById(dto.timeSlot);
    if (!slot) {
      throw new BadRequestException('Invalid time slot');
    }
    const tutorAvailability = await this.availabilityModel.findById(
      new Types.ObjectId(slot.tutorAvailability),
    );
    if (!tutorAvailability) {
      throw new BadRequestException('Tutor availability not found');
    }
    const tutorProfile = await this.tutorProfileModel.findOne({
      userId: new Types.ObjectId(tutorAvailability.user),
    });

    if (!tutorProfile) {
      throw new BadRequestException('Tutor profile not found');
    }

    // Compute duration in hours
    const start = new Date(slot.startTime).getTime();
    const end = new Date(slot.endTime).getTime();
    const hours = Math.max(0.25, (end - start) / (1000 * 60 * 60));

    const amount = Number((tutorProfile.hourlyRate * hours).toFixed(2));

    // Create Stripe Checkout Session and attach bookingId metadata
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success?bookingId=${booking._id}`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-cancel?bookingId=${booking._id}`;

    const session = await this.paymentsService.createCheckoutSession({
      amount,
      currency: 'eur', // euro only
      successUrl,
      cancelUrl,
      metadata: { bookingId: String(booking._id) },
      customerEmail: (user && user.email) || undefined,
      description: `Lesson with tutor ${String(tutorProfile.user)}`,
    });

    return {
      message: 'Booking successful, proceed to payment',
      booking,
      payment: {
        checkoutUrl: session.url,
        sessionId: session.id,
        amount,
      },
    };
  }

  // async updateBookingStatus(bookingId: string, status: string) {
  //   return this.bookingModel.findByIdAndUpdate(
  //     bookingId,
  //     { status },
  //     { new: true },
  //   );
  // }

  // async getMyBookings(user: any) {
  //   const bookings = await this.bookingStudentsModel
  //     .find({ student: user.userId })
  //     .populate('booking');
  //   return bookings.map((b) => b.booking);
  // }

  // async getMySchedule(user: any) {
  //   // Find bookings where user is tutor (stub)
  //   return [];
  // }

  // async getBookingDetails(bookingId: string) {
  //   return this.bookingModel.findById(bookingId);
  // }
}
