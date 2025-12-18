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
  /**
   * BookingsService
   *
   * Responsible for creating bookings, linking students to bookings,
   * creating lesson reports and initiating payment (Checkout session).
   * Bookings are initially created with `PENDING` status and only
   * become `SCHEDULED` after successful payment (via Stripe webhook).
   */
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

  /**
   * Create a booking and initiate payment.
   *
   * Steps:
   * - persist a `Booking` with status `PENDING`
   * - create a `BookingStudents` record linking the booking to the student
   * - create a stub `LessonReport`
   * - compute amount from the timeslot and tutor hourly rate
   * - create a Stripe Checkout Session and return the `checkoutUrl` and `sessionId`
   *
   * @param user - authenticated user (student)
   * @param dto - validated booking DTO containing `timeSlot`, `subject`, `type`
   * @returns booking and payment session details
   * @throws BadRequestException when slot/tutor/profile are missing
   */
  async createBooking(user: any, dto: CreateBookingDto) {
    // Load timeslot first and ensure it exists
    const slot = await this.timeSlotModel.findById(dto.timeSlot);
    if (!slot) {
      throw new BadRequestException('Invalid time slot');
    }

    // Ensure the timeslot isn't already booked (pending or scheduled)
    const existing = await this.bookingModel.findOne({
      timeSlot: new Types.ObjectId(slot._id),
      status: { $in: ['PENDING', 'SCHEDULED'] },
    });

    if (existing) {
      throw new BadRequestException('You have already booked this time slot');
    }

    const booking = new this.bookingModel({
      timeSlot: new Types.ObjectId(slot._id),
      subject: dto.subject,
      type: dto.type,
      student: new Types.ObjectId(user.userId),
      status: 'PENDING',
    });

    await booking.save();

    const bookingStudent = new this.bookingStudentsModel({
      booking: new Types.ObjectId(booking._id),
      student: new Types.ObjectId(user.userId),
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

    // tutor info to compute amount
    const tutorAvailability = await this.availabilityModel.findById(
      new Types.ObjectId(slot.tutorAvailability),
    );

    if (!tutorAvailability) {
      throw new BadRequestException('Tutor availability not found');
    }
    const tutorProfile = await this.tutorProfileModel.findOne({
      user: new Types.ObjectId(tutorAvailability.user),
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
      metadata: {
        bookingId: String(booking._id),
        studentId: String(user.userId),
        tutorId: String(tutorAvailability.user),
      },
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
