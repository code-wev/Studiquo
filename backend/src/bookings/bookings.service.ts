import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'common/dto/pagination.dto';
import { formatAmPm } from 'common/utils/time.util';
import { Model, Types } from 'mongoose';
import { TimeSlot } from 'src/models/TimeSlot.model';
import { TutorAvailability } from 'src/models/TutorAvailability.model';
import { TutorProfile } from 'src/models/TutorProfile.model';
import { User } from 'src/models/User.model';
import { PaymentsService } from 'src/payments/payments.service';
import { Booking } from '../models/Booking.model';
import { BookingStudents } from '../models/BookingStudents.model';
import { LessonReport } from '../models/LessonReport.model';
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
    // If the students is not have any connected parents throw error
    const student = await this.userModel.findById(user.userId);

    if (!student || !student.parents || student.parents.length === 0) {
      throw new BadRequestException(
        'You must have at least one connected parent to create a booking',
      );
    }

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
    const parentId = new Types.ObjectId(user.userId);

    const bookings = await this.userModel.aggregate([
      // 1️. Match parent
      { $match: { _id: parentId } },

      // 2️. Project children
      { $project: { children: 1 } },

      // 3️. Lookup bookingStudents
      {
        $lookup: {
          from: 'bookingstudents',
          localField: 'children',
          foreignField: 'student',
          as: 'bookingStudent',
        },
      },
      { $unwind: '$bookingStudent' },

      // 4️. Lookup booking
      {
        $lookup: {
          from: 'bookings',
          localField: 'bookingStudent.booking',
          foreignField: '_id',
          as: 'booking',
        },
      },
      { $unwind: '$booking' },

      // 5. Lookup timeSlot (SINGLE DOC)
      {
        $lookup: {
          from: 'timeslots',
          localField: 'booking.timeSlot',
          foreignField: '_id',
          as: 'timeSlot',
        },
      },
      { $unwind: '$timeSlot' },

      // 6. TutorAvailability
      {
        $lookup: {
          from: 'tutoravailabilities',
          localField: 'timeSlot.tutorAvailability',
          foreignField: '_id',
          as: 'availability',
        },
      },
      { $unwind: '$availability' },

      // 7. TutorProfile
      {
        $lookup: {
          from: 'tutorprofiles',
          localField: 'availability.user',
          foreignField: 'user',
          as: 'tutorProfile',
        },
      },
      { $unwind: '$tutorProfile' },

      // 8. Pagination
      { $skip: (page - 1) * limit },
      { $limit: limit },

      // 9. Final Projection (FIXED)
      {
        $project: {
          _id: 0,
          bookingId: '$booking._id',
          studentId: '$bookingStudent.student',
          status: '$booking.status',
          subject: '$booking.subject',
          type: '$booking.type',

          price: {
            $cond: {
              if: { $eq: ['$booking.type', 'GROUP'] },
              then: '$tutorProfile.groupHourlyRate',
              else: '$tutorProfile.oneOnOneHourlyRate',
            },
          },

          slot: {
            id: '$timeSlot._id',
            subject: '$timeSlot.subject',
            type: '$timeSlot.type',
            // Conditional meetLink
            meetLink: {
              $cond: {
                if: { $in: ['$booking.status', ['PENDING', 'CANCELLED']] },
                then: null,
                else: '$timeSlot.meetLink',
              },
            },
            startTime: '$timeSlot.startTime',
            endTime: '$timeSlot.endTime',
          },
        },
      },
    ]);

    const result = bookings.map((b) => ({
      ...b,
      slot: {
        ...b.slot,
        startTime: formatAmPm(b.slot.startTime),
        endTime: formatAmPm(b.slot.endTime),
      },
    }));

    return {
      message: 'Children bookings retrieved successfully',
      page,
      limit,
      total: bookings.length,
      bookings: result,
    };
  }

  /**
   * Create a payment link (Stripe Checkout Session) for an existing booking.
   *
   * @param user - authenticated parent user
   * @param bookingId - ID of the booking to pay for
   * @param studentId - ID of the child/student for whom the booking was made
   */
  async createPaymentLinkForBooking(
    user: any,
    { bookingId, studentId }: CreatePaymentLinkDto,
  ) {
    // 1. Validate booking
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new BadRequestException('Invalid booking ID');
    }

    // 2. Validate parent-child relationship
    const parent = await this.userModel.findOne({
      _id: new Types.ObjectId(user.userId),
      children: { $in: [new Types.ObjectId(studentId)] },
    });

    if (!parent) {
      throw new BadRequestException(
        'You do not have a child with the specified student ID',
      );
    }

    // 3. Ensure booking belongs to this child
    const isChildBooking = await this.bookingStudentsModel.findOne({
      booking: new Types.ObjectId(bookingId),
      student: new Types.ObjectId(studentId),
    });

    if (!isChildBooking) {
      throw new BadRequestException(
        'This booking does not belong to your child',
      );
    }

    // 4. Booking must be pending
    if (booking.status !== 'PENDING') {
      throw new BadRequestException(
        'Payment can only be made for PENDING bookings',
      );
    }

    // 5. Load timeslot
    const slot = await this.timeSlotModel.findById(booking.timeSlot);
    if (!slot) {
      throw new BadRequestException('Invalid time slot');
    }

    // 6. Enforce 3-day advance payment rule
    const minAdvanceMs = 3 * 24 * 60 * 60 * 1000;
    if (new Date(slot.startTime).getTime() - Date.now() < minAdvanceMs) {
      throw new BadRequestException(
        'Payment must be completed at least 3 days before the lesson',
      );
    }

    // 7. Load tutor availability
    const availability = await this.availabilityModel.findById(
      slot.tutorAvailability,
    );
    if (!availability) {
      throw new BadRequestException('Tutor availability not found');
    }

    // 8. Load tutor profile + tutor user
    const tutorProfile = await this.tutorProfileModel
      .findOne({ user: availability.user })
      .populate('user', 'firstName lastName email');

    if (!tutorProfile || !tutorProfile.user) {
      throw new BadRequestException('Tutor profile not found');
    }

    const tutorUser = tutorProfile.user as any;

    // 9. Calculate duration
    const hours = Math.max(
      0.25,
      (new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) /
        (1000 * 60 * 60),
    );

    // 10. Calculate price
    const amount = Number(
      (booking.type === 'ONE_TO_ONE'
        ? tutorProfile.oneOnOneHourlyRate * hours
        : tutorProfile.groupHourlyRate * hours
      ).toFixed(2),
    );

    // 11. Stripe URLs
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const successUrl = `${frontendUrl}/payment-success?bookingId=${booking._id}`;
    const cancelUrl = `${frontendUrl}/payment-cancel?bookingId=${booking._id}`;

    // 12. Create Stripe Checkout Session
    const session = await this.paymentsService.createCheckoutSession({
      amount,
      currency: process.env.STRIPE_CURRENCY || 'gbp', // Pound sterling GBP not supported in Stripe test mode
      successUrl,
      cancelUrl,
      customerEmail: parent.email,
      description: `Lesson with ${tutorUser.firstName} ${tutorUser.lastName}`,
      metadata: {
        bookingId: String(booking._id),
        studentId: String(studentId),
        tutorId: String(tutorUser._id),
        tutorName: `${tutorUser.firstName} ${tutorUser.lastName}`,
        subject: booking.subject,
        slotEndTime: new Date(slot.endTime).toISOString(),
      },
    });

    // 13. Final response
    return {
      checkoutUrl: session.url,
      sessionId: session.id,
      amount,
      tutor: {
        id: tutorUser._id,
        firstName: tutorUser.firstName,
        lastName: tutorUser.lastName,
      },
      booking: {
        id: booking._id,
        subject: booking.subject,
        type: booking.type,
      },
    };
  }

  /**
   * Get all upcoming bookings for the authenticated student.
   *
   * @param user - authenticated student user
   * @return list of upcoming bookings for the student
   */
  async getMyUpcomingBookings(user: any) {
    // Get today's date boundaries
    const today = new Date();
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const result = await this.bookingModel.aggregate([
      // Step 1: Find all booking IDs for this student
      {
        $lookup: {
          from: 'bookingstudents',
          let: { bookingId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$booking', '$$bookingId'] },
                    { $eq: ['$student', new Types.ObjectId(user.userId)] },
                  ],
                },
              },
            },
          ],
          as: 'studentBooking',
        },
      },

      // Step 2: Filter only bookings where this student is enrolled
      {
        $match: {
          'studentBooking.0': { $exists: true },
        },
      },

      // Step 3: Populate timeSlot details
      {
        $lookup: {
          from: 'timeslots',
          localField: 'timeSlot',
          foreignField: '_id',
          as: 'timeSlotDetails',
        },
      },

      // Step 4: Unwind timeSlotDetails
      {
        $unwind: {
          path: '$timeSlotDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Step 5: Get tutor availability linked to the time slot
      {
        $lookup: {
          from: 'tutoravailabilities',
          localField: 'timeSlotDetails.tutorAvailability',
          foreignField: '_id',
          as: 'tutorAvailability',
        },
      },

      // Step 6: Unwind tutorAvailability
      {
        $unwind: {
          path: '$tutorAvailability',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Step 7: Get tutor details from tutorAvailability
      {
        $lookup: {
          from: 'users',
          localField: 'tutorAvailability.user',
          foreignField: '_id',
          as: 'tutorDetails',
        },
      },

      // Step 8: Unwind tutorDetails
      {
        $unwind: {
          path: '$tutorDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Step 9: Add fields for calculations
      {
        $addFields: {
          bookingDate: '$tutorAvailability.date',
          isToday: {
            $and: [
              { $gte: ['$tutorAvailability.date', todayStart] },
              { $lte: ['$tutorAvailability.date', todayEnd] },
            ],
          },
          isCompleted: { $eq: ['$status', 'COMPLETED'] },
        },
      },

      // Step 10: Use facet to get both grouped bookings and stats in one query
      {
        $facet: {
          // Main pipeline for grouped bookings (upcoming only)
          groupedBookings: [
            // Filter only upcoming bookings
            {
              $match: {
                bookingDate: { $gte: new Date() },
              },
            },
            // Format individual booking documents
            {
              $project: {
                _id: 1,
                subject: 1,
                type: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                timeSlot: {
                  _id: '$timeSlotDetails._id',
                  startTime: '$timeSlotDetails.startTime',
                  endTime: '$timeSlotDetails.endTime',
                  subject: '$timeSlotDetails.subject',
                  type: '$timeSlotDetails.type',
                  meetLink: {
                    $cond: {
                      if: { $in: ['$status', ['COMPLETED', 'SCHEDULED']] },
                      then: '$timeSlotDetails.meetLink',
                      else: null,
                    },
                  },
                },
                tutor: {
                  _id: '$tutorDetails._id',
                  firstName: '$tutorDetails.firstName',
                  lastName: '$tutorDetails.lastName',
                  avatar: '$tutorDetails.avatar',
                },
                bookingDate: 1,
              },
            },
            // Group by date
            {
              $group: {
                _id: '$bookingDate',
                date: { $first: '$bookingDate' },
                list: {
                  $push: {
                    _id: '$_id',
                    subject: '$subject',
                    type: '$type',
                    status: '$status',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                    timeSlot: '$timeSlot',
                    tutor: '$tutor',
                  },
                },
                totalBookings: { $sum: 1 },
              },
            },
            // Format grouped response
            {
              $project: {
                _id: 0,
                date: 1,
                list: 1,
                totalBookings: 1,
              },
            },
            // Sort by date
            {
              $sort: {
                date: 1,
              },
            },
          ],

          // Pipeline for statistics - Only the 3 required stats
          statsCalculation: [
            // Calculate all stats in one group stage
            {
              $group: {
                _id: null,
                totalClasses: { $sum: 1 }, // Total all bookings
                todayClasses: {
                  $sum: {
                    $cond: {
                      if: '$isToday',
                      then: 1,
                      else: 0,
                    },
                  },
                },
                completedClasses: {
                  $sum: {
                    $cond: {
                      if: '$isCompleted',
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
            // Format stats object
            {
              $project: {
                _id: 0,
                totalClasses: 1,
                todayClasses: 1,
                completedClasses: 1,
              },
            },
          ],
        },
      },

      // Step 11: Format the final response structure
      {
        $project: {
          bookings: {
            $cond: {
              if: { $gt: [{ $size: '$groupedBookings' }, 0] },
              then: '$groupedBookings',
              else: [],
            },
          },
          stats: {
            $cond: {
              if: { $gt: [{ $size: '$statsCalculation' }, 0] },
              then: { $arrayElemAt: ['$statsCalculation', 0] },
              else: {
                totalClasses: 0,
                todayClasses: 0,
                completedClasses: 0,
              },
            },
          },
        },
      },
    ]);

    // Extract the single result from facet
    const finalResult = result[0] || {
      bookings: [],
      stats: {
        totalClasses: 0,
        todayClasses: 0,
        completedClasses: 0,
      },
    };

    return {
      success: true,
      message: 'Upcoming bookings retrieved successfully',
      method: 'GET',
      statusCode: 200,
      timestamp: new Date().toISOString(),
      data: {
        bookings: finalResult.bookings,
        stats: finalResult.stats,
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

  // async getMySchedule(user: any) {
  //   // Find bookings where user is tutor (stub)
  //   return [];
  // }

  // async getBookingDetails(bookingId: string) {
  //   return this.bookingModel.findById(bookingId);
  // }
}
