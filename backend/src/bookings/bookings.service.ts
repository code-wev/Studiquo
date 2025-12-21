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

    // Check if time slot is already fully booked
    // First, get all bookings for this time slot
    const existingBookings = await this.bookingModel
      .find({
        timeSlot: new Types.ObjectId(slot._id),
        status: { $in: ['PENDING', 'SCHEDULED'] },
      })
      .populate('timeSlot');

    if (existingBookings.length > 0) {
      // For ONE_TO_ONE: can only have one booking
      if (dto.type === 'ONE_TO_ONE') {
        throw new BadRequestException('This time slot is already booked');
      }

      // For GROUP: check capacity
      if (dto.type === 'GROUP') {
        // Get total students already enrolled in this time slot
        const bookingIds = existingBookings.map((b) => b._id);
        const enrolledStudentsCount =
          await this.bookingStudentsModel.countDocuments({
            booking: { $in: bookingIds },
          });

        // You need to define max capacity for group sessions
        // Assuming you have a field in TimeSlot or a constant
        const maxGroupCapacity = 500; // Adjust this based on your requirements

        if (enrolledStudentsCount >= maxGroupCapacity) {
          throw new BadRequestException('This group session is already full');
        }
      }
    }

    // Also check if the current student already has a booking in this time slot
    const studentExistingBooking = await this.bookingModel.findOne({
      timeSlot: new Types.ObjectId(slot._id),
      status: { $in: ['PENDING', 'SCHEDULED'] },
    });

    if (studentExistingBooking) {
      // Check if this student is already enrolled in the booking
      const existingStudentBooking = await this.bookingStudentsModel.findOne({
        booking: studentExistingBooking._id,
        student: new Types.ObjectId(user.userId),
      });

      if (existingStudentBooking) {
        throw new BadRequestException('You have already booked this time slot');
      }
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

      // 5. Lookup timeSlot
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

      // 8. Add status order for sorting
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$booking.status', 'PENDING'] }, then: 1 },
                { case: { $eq: ['$booking.status', 'SCHEDULED'] }, then: 2 },
                { case: { $eq: ['$booking.status', 'CANCELLED'] }, then: 3 },
                { case: { $eq: ['$booking.status', 'COMPLETED'] }, then: 4 },
              ],
              default: 5,
            },
          },
        },
      },

      // 9. Sort: PENDING first, then by date (earliest first)
      {
        $sort: {
          statusOrder: 1, // PENDING (1) appears first
          'availability.date': 1, // Earliest dates first
          'timeSlot.startTime': 1, // Earliest times first
        },
      },

      // 10. Pagination
      { $skip: (page - 1) * limit },
      { $limit: limit },

      // 11. Final Projection
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
            meetLink: {
              $cond: {
                if: { $in: ['$booking.status', ['SCHEDULED', 'COMPLETED']] },
                then: '$timeSlot.meetLink',
                else: null,
              },
            },
            startTime: '$timeSlot.startTime',
            endTime: '$timeSlot.endTime',
            date: '$availability.date',
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
    const today = new Date().getUTCDay();
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

  /**
   * Get all bookings for the authenticated tutor in the current month.
   * Grouped by date with details of each time slot and enrolled students.
   *
   * @param user - authenticated tutor user
   * @return list of tutor bookings grouped by date for the current month
   */
  async getTutorBookings(user: any) {
    // Get current month boundaries
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    currentMonthEnd.setHours(23, 59, 59, 999);

    const result = await this.bookingModel.aggregate([
      // Step 1: Get time slots for the tutor in current month
      {
        $lookup: {
          from: 'timeslots',
          localField: 'timeSlot',
          foreignField: '_id',
          as: 'timeSlotDetails',
        },
      },

      // Step 2: Unwind timeSlotDetails
      {
        $unwind: {
          path: '$timeSlotDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Step 3: Get tutor availability for the time slot
      {
        $lookup: {
          from: 'tutoravailabilities',
          localField: 'timeSlotDetails.tutorAvailability',
          foreignField: '_id',
          as: 'tutorAvailability',
        },
      },

      // Step 4: Unwind tutorAvailability
      {
        $unwind: {
          path: '$tutorAvailability',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Step 5: Filter only bookings for this tutor in current month
      {
        $match: {
          'tutorAvailability.user': new Types.ObjectId(user.userId),
          'tutorAvailability.date': {
            $gte: currentMonthStart,
            $lte: currentMonthEnd,
          },
        },
      },

      // Step 6: Get all students enrolled in each booking (but only for counting)
      {
        $lookup: {
          from: 'bookingstudents',
          localField: '_id',
          foreignField: 'booking',
          as: 'enrolledStudents',
        },
      },

      // Step 7: Get tutor details (optional)
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
          studentsCount: { $size: '$enrolledStudents' },
          isToday: {
            $and: [
              {
                $gte: [
                  '$tutorAvailability.date',
                  new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                ],
              },
              {
                $lte: [
                  '$tutorAvailability.date',
                  new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    23,
                    59,
                    59,
                    999,
                  ),
                ],
              },
            ],
          },
        },
      },

      // Step 10: Use facet to get both grouped bookings and stats
      {
        $facet: {
          // Main pipeline for grouped bookings by date
          groupedBookings: [
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
                  meetLink: '$timeSlotDetails.meetLink',
                },
                bookingDate: 1,
                studentsCount: 1,
              },
            },
            // Group by date first, then by time slot (since multiple bookings can share same time slot)
            {
              $group: {
                _id: {
                  date: '$bookingDate',
                  slotId: '$timeSlot._id',
                },
                date: { $first: '$bookingDate' },
                slotDetails: { $first: '$timeSlot' },
                bookings: {
                  $push: {
                    _id: '$_id',
                    subject: '$subject',
                    type: '$type',
                    status: '$status',
                    createdAt: '$createdAt',
                    updatedAt: '$updatedAt',
                    studentsCount: '$studentsCount',
                  },
                },
                totalStudentsInSlot: { $sum: '$studentsCount' },
                slotBookingsCount: { $sum: 1 },
              },
            },
            // Now group by date only
            {
              $group: {
                _id: '$date',
                date: { $first: '$date' },
                timeSlots: {
                  $push: {
                    slotId: '$slotDetails._id',
                    startTime: '$slotDetails.startTime',
                    endTime: '$slotDetails.endTime',
                    subject: '$slotDetails.subject',
                    type: '$slotDetails.type',
                    meetLink: '$slotDetails.meetLink',
                    bookings: '$bookings',
                    totalStudentsInSlot: '$totalStudentsInSlot',
                    slotBookingsCount: '$slotBookingsCount',
                  },
                },
                totalBookings: { $sum: '$slotBookingsCount' },
                totalStudents: { $sum: '$totalStudentsInSlot' },
              },
            },
            // Format grouped response (removed subjects array)
            {
              $project: {
                _id: 0,
                date: 1,
                dateString: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$date',
                  },
                },
                totalBookings: 1,
                totalStudents: 1,
                timeSlots: {
                  $map: {
                    input: {
                      $sortArray: {
                        input: '$timeSlots',
                        sortBy: { startTime: 1 },
                      },
                    },
                    as: 'slot',
                    in: {
                      slotId: '$$slot.slotId',
                      startTime: '$$slot.startTime',
                      endTime: '$$slot.endTime',
                      subject: '$$slot.subject',
                      type: '$$slot.type',
                      meetLink: '$$slot.meetLink',
                      slotBookingsCount: '$$slot.slotBookingsCount',
                      totalStudentsInSlot: '$$slot.totalStudentsInSlot',
                      bookings: {
                        $map: {
                          input: '$$slot.bookings',
                          as: 'booking',
                          in: {
                            _id: '$$booking._id',
                            subject: '$$booking.subject',
                            type: '$$booking.type',
                            status: '$$booking.status',
                            createdAt: '$$booking.createdAt',
                            updatedAt: '$$booking.updatedAt',
                            studentsCount: '$$booking.studentsCount',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            // Sort by date
            {
              $sort: {
                date: 1,
              },
            },
          ],

          // Pipeline for statistics
          statsCalculation: [
            // Calculate all stats in one group stage
            {
              $group: {
                _id: null,
                totalBookings: { $sum: 1 },
                totalStudents: { $sum: '$studentsCount' },
                todayBookings: {
                  $sum: {
                    $cond: {
                      if: '$isToday',
                      then: 1,
                      else: 0,
                    },
                  },
                },
                completedBookings: {
                  $sum: {
                    $cond: {
                      if: { $eq: ['$status', 'COMPLETED'] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                scheduledBookings: {
                  $sum: {
                    $cond: {
                      if: { $eq: ['$status', 'SCHEDULED'] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                pendingBookings: {
                  $sum: {
                    $cond: {
                      if: { $eq: ['$status', 'PENDING'] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                cancelledBookings: {
                  $sum: {
                    $cond: {
                      if: { $eq: ['$status', 'CANCELLED'] },
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
                totalBookings: 1,
                totalStudents: 1,
                todayBookings: 1,
                completedBookings: 1,
                scheduledBookings: 1,
                pendingBookings: 1,
                cancelledBookings: 1,
                // Calculate averages
                avgStudentsPerBooking: {
                  $cond: {
                    if: { $gt: ['$totalBookings', 0] },
                    then: { $divide: ['$totalStudents', '$totalBookings'] },
                    else: 0,
                  },
                },
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
                totalBookings: 0,
                totalStudents: 0,
                todayBookings: 0,
                completedBookings: 0,
                scheduledBookings: 0,
                pendingBookings: 0,
                cancelledBookings: 0,
                avgStudentsPerBooking: 0,
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
        totalBookings: 0,
        totalStudents: 0,
        todayBookings: 0,
        completedBookings: 0,
        scheduledBookings: 0,
        pendingBookings: 0,
        cancelledBookings: 0,
        avgStudentsPerBooking: 0,
      },
    };

    return {
      message: 'Tutor bookings retrieved successfully',
      bookings: finalResult.bookings,
      stats: finalResult.stats,
      currentMonth: {
        start: currentMonthStart.toISOString(),
        end: currentMonthEnd.toISOString(),
        month: now.toLocaleString('default', { month: 'long' }),
        year: now.getFullYear(),
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
