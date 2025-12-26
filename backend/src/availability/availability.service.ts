import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from 'src/models/Booking.model';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { formatAmPm } from '../../common/utils/time.util';
import { TimeSlotType } from '../models/TimeSlot.model';
import { TutorAvailability } from '../models/TutorAvailability.model';
import { TutorProfile, TutorSubject } from '../models/TutorProfile.model';
import { UserRole } from '../models/User.model';
import { TimeSlot } from './../models/TimeSlot.model';
import {
  CreateAvailabilityDto,
  CreateTimeSlotDto,
  UpdateTimeSlotDto,
} from './dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(TutorAvailability.name)
    private availabilityModel: Model<TutorAvailability>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(TimeSlot.name) private timeSlotModel: Model<TimeSlot>,
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfile>,
  ) {}

  /**
   * Create a TutorAvailability document for a tutor on a specific date.
   *
   * @param req - Request object containing authenticated user
   * @param dto - DTO containing the date to create availability for
   * @throws BadRequestException if date is invalid
   */
  async addAvailability(user: any, dto: CreateAvailabilityDto) {
    const date = new Date(dto.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    // Only allow creating availability for the current month (UTC)
    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    const startOfNextMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    const dateOnly = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );

    // incoming date can't be in the past
    const todayUtc = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
      ),
    );

    if (dateOnly < todayUtc) {
      throw new BadRequestException(
        'Cannot create availability for past dates',
      );
    }

    const existing = await this.availabilityModel.findOne({
      user: new Types.ObjectId(user.userId),
      date: dateOnly,
    });

    if (existing) {
      throw new BadRequestException(
        'Availability for this date already exists',
      );
    }

    if (date < startOfMonth || date >= startOfNextMonth) {
      throw new BadRequestException(
        'Only current month availability is allowed',
      );
    }

    const availability = await this.availabilityModel.create({
      user: new Types.ObjectId(user.userId),
      date: dateOnly,
    });

    return {
      message: 'Availability added successfully',
      availability,
    };
  }

  /**
   * Delete a TutorAvailability document by ID.
   *
   * @param user - Authenticated user object
   * @param availabilityId - ID of the TutorAvailability to delete
   * @throws NotFoundException if availability not found
   */
  async deleteAvailability(user: any, availabilityId: MongoIdDto['id']) {
    const availability = await this.availabilityModel.findOne({
      _id: availabilityId,
      user: user.userId,
    });

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    // 1. Get booked slot existence in ONE lightweight query
    const hasBookedSlots = await this.bookingModel.exists({
      status: { $in: ['PENDING', 'SCHEDULED'] },
      timeSlot: {
        $in: await this.timeSlotModel.distinct('_id', {
          tutorAvailability: availability._id,
        }),
      },
    });

    if (hasBookedSlots) {
      throw new BadRequestException(
        'Cannot delete availability with booked time slots',
      );
    }

    // 2. Delete slots + availability
    await Promise.all([
      this.timeSlotModel.deleteMany({
        tutorAvailability: availability._id,
      }),
      availability.deleteOne(),
    ]);

    return {
      message: 'Availability and associated time slots deleted successfully',
    };
  }

  /**
   * Add a timeslot under an existing TutorAvailability document.
   *
   * @param user - Authenticated user object
   * @param availabilityId - ID of the TutorAvailability document
   * @param dto - Timeslot DTO containing start/end times and optional meet link
   * @throws NotFoundException if availabilityId is invalid
   * @throws BadRequestException if time slot is invalid or overlaps
   */
  async addTimeSlot(
    user: any,
    availabilityId: MongoIdDto['id'],
    dto: CreateTimeSlotDto,
  ): Promise<TimeSlot> {
    /*
     * 1. Check the tutor's subject exists
     */
    const subjectsExists = await this.tutorProfileModel.findOne({
      user: new Types.ObjectId(user.userId),
      subjects: {
        $in: [dto.subject],
      },
    });

    if (!subjectsExists) {
      throw new BadRequestException(
        'Tutor does not teach the specified subject',
      );
    }

    /**
     * 2. Check availability exists
     */
    const availability = await this.availabilityModel
      .findById(new Types.ObjectId(availabilityId))
      .exec();

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    /**
     * 3. Prevent adding slots to past dates
     * Compare DATE ONLY (UTC)
     */
    const todayUtc = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
      ),
    );

    if (availability.date < todayUtc) {
      throw new BadRequestException('Cannot add time slots to past dates');
    }

    /**
     * 4. Parse & validate times
     */
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new BadRequestException('Invalid start or end time');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    /**
     * 5. Ensure slot belongs to the same availability date (UTC)
     */
    const availabilityDateOnly = new Date(
      Date.UTC(
        availability.date.getUTCFullYear(),
        availability.date.getUTCMonth(),
        availability.date.getUTCDate(),
      ),
    );

    const slotDateOnly = new Date(
      Date.UTC(
        startTime.getUTCFullYear(),
        startTime.getUTCMonth(),
        startTime.getUTCDate(),
      ),
    );

    if (availabilityDateOnly.getTime() !== slotDateOnly.getTime()) {
      throw new BadRequestException(
        'Time slot must be on the same date as availability',
      );
    }

    /**
     * 6. Overlapping slot check (CRITICAL)
     *
     * Overlap condition:
     * existing.start < new.end && existing.end > new.start
     */
    const overlappingSlot = await this.timeSlotModel.findOne({
      tutorAvailability: new Types.ObjectId(availability._id),
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlappingSlot) {
      throw new BadRequestException('Time slot overlaps with an existing slot');
    }

    /**
     * 7. Create slot
     */
    return this.timeSlotModel.create({
      tutorAvailability: availability._id,
      startTime,
      endTime,
      meetLink: dto.meetLink ?? undefined,
      type: dto.type,
      subject: dto.subject,
    });
  }

  /**
   * Update a time slot by ID.
   *
   * @req - Request object containing authenticated user
   * @param slotId - ID of the TimeSlot to update
   * @param dto - Partial timeslot fields to update
   * @throws NotFoundException if time slot not found
   * @throws BadRequestException if updated times are invalid or overlap
   */
  async updateSlot(
    user: any,
    slotId: MongoIdDto['id'],
    dto: UpdateTimeSlotDto,
  ): Promise<TimeSlot> {
    // 1. Validate subject (only if provided)
    if (dto.subject) {
      const subjectExists = await this.tutorProfileModel.exists({
        user: user.userId,
        subjects: dto.subject,
      });

      if (!subjectExists) {
        throw new BadRequestException(
          'Tutor does not teach the specified subject',
        );
      }
    }

    // 2. Fetch slot owned by tutor (single query)
    const slot = await this.timeSlotModel.findOne({
      _id: slotId,
      tutorAvailability: {
        $in: await this.availabilityModel
          .find({ user: user.userId })
          .distinct('_id'),
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    // 3. Check if slot is booked (FAST)
    const isBooked = await this.bookingModel.exists({
      timeSlot: slot._id,
      status: { $in: ['PENDING', 'SCHEDULED'] },
    });

    // 4. If booked → block time changes
    if (isBooked && (dto.startTime || dto.endTime)) {
      throw new BadRequestException('Cannot change time for a booked slot');
    }

    // 5. Time validation + overlap check (only if allowed)
    if (!isBooked && (dto.startTime || dto.endTime)) {
      const startTime = dto.startTime
        ? new Date(dto.startTime)
        : slot.startTime;
      const endTime = dto.endTime ? new Date(dto.endTime) : slot.endTime;

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new BadRequestException('Invalid start or end time');
      }

      if (startTime >= endTime) {
        throw new BadRequestException('Start time must be before end time');
      }

      // Overlap check (index-friendly)
      const hasOverlap = await this.timeSlotModel.exists({
        tutorAvailability: slot.tutorAvailability,
        _id: { $ne: slot._id },
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      });

      if (hasOverlap) {
        throw new BadRequestException(
          'Updated time slot overlaps with existing slot',
        );
      }

      slot.startTime = startTime;
      slot.endTime = endTime;
    }

    // 6. Metadata updates (allowed even if booked)
    if (dto.meetLink !== undefined) slot.meetLink = dto.meetLink;
    if (dto.type) slot.type = dto.type as TimeSlotType;
    if (dto.subject) slot.subject = dto.subject as TutorSubject;

    return slot.save();
  }

  /**
   * Delete a time slot by ID.
   *
   * @req - Request object containing authenticated user
   * @param slotId - ID of the TimeSlot to delete
   * @throws NotFoundException if time slot not found
   */
  async deleteSlot(user: any, slotId: MongoIdDto['id']): Promise<TimeSlot> {
    // 1. Find slot owned by tutor (single lookup)
    const slot = await this.timeSlotModel.findOne({
      _id: slotId,
      tutorAvailability: {
        $in: await this.availabilityModel
          .find({ user: user.userId })
          .distinct('_id'),
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    // 2. Check if slot is booked
    const isBooked = await this.bookingModel.exists({
      timeSlot: slot._id,
      status: { $in: ['PENDING', 'SCHEDULED'] },
    });

    if (isBooked) {
      throw new BadRequestException('Cannot delete a booked time slot');
    }

    // 3. Delete slot
    await slot.deleteOne();

    return slot;
  }

  /**
   * Return all available time slots for a given tutor, grouped by date.
   *
   * @param user - Authenticated user object (optional)
   * @param tutorId - ID of the tutor (user)
   * @returns Tutor availability with profile + rating
   */
  async getTutorAvailability(user?: any, tutorId?: MongoIdDto['id']) {
    const now = new Date();

    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );

    const startOfNextMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    const result = await this.availabilityModel.aggregate([
      /* ---------------- Match tutor & month ---------------- */
      {
        $match: {
          user: new Types.ObjectId(tutorId),
          date: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },

      /* ---------------- User lookup ---------------- */
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false,
        },
      },

      /* ---------------- Tutor profile lookup ---------------- */
      {
        $lookup: {
          from: 'tutorprofiles', // ✅ correct collection name
          localField: 'user._id',
          foreignField: 'user',
          as: 'tutorProfile',
        },
      },
      {
        $unwind: {
          path: '$tutorProfile',
          preserveNullAndEmptyArrays: true,
        },
      },

      /* ---------------- Rating aggregation ---------------- */
      {
        $lookup: {
          from: 'reviews',
          let: { tutorId: '$user._id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$tutor', '$$tutorId'] },
              },
            },
            {
              $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 },
              },
            },
          ],
          as: 'ratingStats',
        },
      },

      /* ---------------- Time slots ---------------- */
      {
        $lookup: {
          from: 'timeslots',
          let: {
            availabilityId: '$_id',
            subjects: '$tutorProfile.subjects',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$tutorAvailability', '$$availabilityId'] },
                    { $in: ['$subject', '$$subjects'] },
                  ],
                },
              },
            },
            { $sort: { startTime: 1 } },
          ],
          as: 'slots',
        },
      },

      /* ---------------- Group by tutor ---------------- */
      {
        $group: {
          _id: '$user._id',
          user: { $first: '$user' },
          tutorProfile: { $first: '$tutorProfile' },
          ratingStats: {
            $first: { $arrayElemAt: ['$ratingStats', 0] },
          },
          availabilities: {
            $push: {
              availabilityId: '$_id',
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$date',
                },
              },
              slots: '$slots',
            },
          },
        },
      },

      /* ---------------- Final shape ---------------- */
      {
        $project: {
          _id: 0,
          tutor: {
            id: '$user._id',
            name: {
              $concat: ['$user.firstName', ' ', '$user.lastName'],
            },
            avatar: '$user.avatar',
            subjects: '$tutorProfile.subjects',
            groupHourlyRate: '$tutorProfile.groupHourlyRate',
            oneOnOneHourlyRate: '$tutorProfile.oneOnOneHourlyRate',
            hourlyRate: '$tutorProfile.hourlyRate',
            averageRating: {
              $ifNull: ['$ratingStats.averageRating', 0],
            },
            totalRatings: {
              $ifNull: ['$ratingStats.totalRatings', 0],
            },
          },
          availabilities: 1,
        },
      },
    ]);

    if (!result.length) {
      return {
        message: 'Tutor availability retrieved successfully',
        tutor: null,
        availabilities: [],
      };
    }

    const data = result[0];

    /* ---------------- Format time labels ---------------- */
    data.availabilities = data.availabilities.map((day) => ({
      ...day,
      slots: day.slots.map((s) => ({
        id: s._id,
        type: s.type,
        startTime: s.startTime,
        endTime: s.endTime,
        meetLink: user?.role === UserRole.Tutor ? s.meetLink : null,
        subject: s.subject,
        startTimeLabel: formatAmPm(s.startTime, 'Europe/London'),
        endTimeLabel: formatAmPm(s.endTime, 'Europe/London'),
      })),
    }));

    return {
      message: 'Tutor availability retrieved successfully',
      tutor: data.tutor,
      availabilities: data.availabilities,
    };
  }
}
