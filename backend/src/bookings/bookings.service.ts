import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'common/dto/pagination.dto';
import { Model, Types } from 'mongoose';
import { TimeSlot } from 'src/models/timeSlot.model';
import { TutorAvailability } from 'src/models/tutorAvailability.model';
import { TutorProfile } from 'src/models/tutorProfile.model';
import { User } from 'src/models/user.model';
import { PaymentsService } from 'src/payments/payments.service';
import { Booking } from '../models/booking.model';
import { BookingStudents } from '../models/bookingStudents.model';
import { LessonReport } from '../models/lessonReport.model';
import { CreateBookingDto, CreatePaymentLinkDto } from './dto/booking.dto';

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
    private paymentsService: PaymentsService,
    @InjectModel(User.name) private userModel: Model<User>,
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

    // Enforce minimum advance booking window: must book at least 3 days before the lesson
    const now = Date.now();
    const slotStart = new Date(slot.startTime).getTime();
    const minAdvanceMs = 3 * 24 * 60 * 60 * 1000; // 3 days
    if (slotStart - now < minAdvanceMs) {
      throw new BadRequestException(
        'Bookings must be made at least 3 days before the lesson',
      );
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

    // Students create bookings but should NOT be able to complete payment.
    // Return the booking record; parents will later generate a payment link.
    return {
      message:
        'Booking created successfully. Please ask your parent to complete the payment.',
      booking,
    };
  }

  /**
   * Get all bookings for the authenticated student's children.
   *
   * @param user - authenticated parent user
   * @return list of bookings for the student's children
   */
  async getChildrenBookings(user: any, pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;

    // Load children of the parent
    const childrenIds = await this.userModel.findOne(
      { _id: new Types.ObjectId(user.userId) },
      { children: 1 },
    );

    // Find bookings for each child
    const bookings = await this.bookingStudentsModel
      .find({ student: { $in: childrenIds?.children || [] } })
      .populate('booking')
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      message: 'Children bookings retrieved successfully',
      bookings: bookings.map((b) => b.booking),
    };
  }

  /**
   * Create a payment link (Stripe Checkout Session) for an existing booking.
   *
   * @param user - authenticated parent user
   * @param bookingId - ID of the booking to pay for
   * @param studentId - ID of the child/student for whom the booking was made
   * @return payment link details
   * @throws BadRequestException for various validation errors
   */
  async createPaymentLinkForBooking(
    user: any,
    { bookingId, studentId }: CreatePaymentLinkDto,
  ) {
    // Validate booking exists
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new BadRequestException('Invalid booking ID');
    }

    // Load parent and ensure they have the specified student as a child
    const parentAndChild = await this.userModel.findOne({
      _id: new Types.ObjectId(user.userId),
      student: { $in: [new Types.ObjectId(studentId)] },
    });

    if (!parentAndChild) {
      throw new BadRequestException(
        'You do not have a child with the specified student ID',
      );
    }

    // Ensure booking belongs to one of the parent's children
    const isChildBooking = await this.bookingStudentsModel.findOne({
      booking: new Types.ObjectId(bookingId),
      student: new Types.ObjectId(studentId),
    });

    if (!isChildBooking) {
      throw new BadRequestException(
        'This booking does not belong to your child',
      );
    }

    // Ensure booking is still pending payment
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        'Payment can only be made for bookings with PENDING status',
      );
    }

    // Gather timeslot and tutor info to compute amount
    const slot = await this.timeSlotModel.findById(booking.timeSlot);

    if (!slot) {
      throw new BadRequestException(
        'Invalid time slot associated with booking',
      );
    }

    // Load tutor availability to get tutor user ID
    const availability = await this.availabilityModel.findOne({
      user: new Types.ObjectId(slot.tutorAvailability),
    });

    if (!availability) {
      throw new BadRequestException(
        'Invalid tutor availability associated with time slot',
      );
    }

    // Ensure tutor profile exists to get hourly rates
    const tutorProfile = await this.tutorProfileModel
      .findOne({
        user: new Types.ObjectId(availability.user),
      })
      .populate('user');

    if (!tutorProfile) {
      throw new BadRequestException('Tutor profile not found');
    }

    // Compute duration in hours
    const start = new Date(slot.startTime).getTime();
    const end = new Date(slot.endTime).getTime();
    const hours = Math.max(0.25, (end - start) / (1000 * 60 * 60));

    const amount = Number(
      (booking.type === 'ONE_TO_ONE'
        ? tutorProfile.oneOnOneHourlyRate
        : tutorProfile.groupHourlyRate * hours
      ).toFixed(2),
    );

    // Build success/cancel URLs
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success?bookingId=${booking._id}`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-cancel?bookingId=${booking._id}`;

    // Create Checkout Session
    const session = await this.paymentsService.createCheckoutSession({
      amount,
      currency: 'eur',
      successUrl,
      cancelUrl,
      metadata: {
        bookingId: String(booking._id),
        studentId: String(studentId),
        parentId: String(user.userId),
      },
      customerEmail: parentAndChild?.email || undefined,
      description: `Lesson with tutor ${String(tutorProfile.user)}`,
    });

    // Persist session info on booking for later webhook reconciliation
    await this.bookingModel.findByIdAndUpdate(booking._id, {
      paymentSessionId: session.id,
      paymentUrl: session.url,
    });

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
      amount,
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
