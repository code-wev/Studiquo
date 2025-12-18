import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { formatAmPm } from 'common/utils/time.util';
import { Model, Types } from 'mongoose';
import { TimeSlot } from '../models/timeSlot.model';
import { TutorAvailability } from '../models/tutorAvailability.model';
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
    @InjectModel(TimeSlot.name) private timeSlotModel: Model<TimeSlot>,
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
    // check the availability has slots and slots are not booked
    const availability = await this.availabilityModel
      .findOne({
        _id: new Types.ObjectId(availabilityId),
        user: new Types.ObjectId(user.userId),
      })
      .exec();

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    const bookedSlots = await this.timeSlotModel.find({
      tutorAvailability: availability._id,
      isBooked: true,
    });

    if (bookedSlots.length > 0) {
      throw new BadRequestException(
        'Cannot delete availability with booked time slots',
      );
    }

    await this.timeSlotModel.deleteMany({
      tutorAvailability: availability._id,
    });

    await availability.deleteOne();
    return {
      message: 'Availability and associated time slots deleted successfully',
    };
  }

  /**
   * Add a timeslot under an existing TutorAvailability document.
   *
   * @param availabilityId - ID of the TutorAvailability document
   * @param dto - Timeslot DTO containing start/end times and optional meet link
   * @throws NotFoundException if availabilityId is invalid
   * @throws BadRequestException if time slot is invalid or overlaps
   */
  async addTimeSlot(
    availabilityId: MongoIdDto['id'],
    dto: CreateTimeSlotDto,
  ): Promise<TimeSlot> {
    /**
     * 1️. Check availability exists
     */
    const availability = await this.availabilityModel
      .findById(new Types.ObjectId(availabilityId))
      .exec();

    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    /**
     * 2️. Prevent adding slots to past dates
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
     * 3️. Parse & validate times
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
     * 4️. Ensure slot belongs to the same availability date (UTC)
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
     * 5️. Overlapping slot check (CRITICAL)
     *
     * Overlap condition:
     * existing.start < new.end && existing.end > new.start
     */
    const overlappingSlot = await this.timeSlotModel.findOne({
      tutorAvailability: availability._id,
      isBooked: false,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlappingSlot) {
      throw new BadRequestException('Time slot overlaps with an existing slot');
    }

    /**
     * 6️. Create slot
     */
    return this.timeSlotModel.create({
      tutorAvailability: availability._id,
      startTime,
      endTime,
      meetLink: dto.meetLink ?? undefined,
      type: dto.type,
      subject: dto.subject,
      isBooked: false,
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
    const slot = await this.timeSlotModel
      .findOne({
        _id: slotId,
        tutorAvailability: {
          $in: await this.availabilityModel
            .find({ user: user.userId })
            .distinct('_id')
            .exec(),
        },
      })
      .exec();

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    // If the slot is already booked, prevent changing times
    if (slot.isBooked && (dto.startTime || dto.endTime)) {
      throw new BadRequestException(
        'Cannot change times of a booked time slot',
      );
    }

    // Validate new times if provided
    if (dto.startTime || dto.endTime) {
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

      // Check for overlaps excluding the current slot
      const overlappingSlots = await this.timeSlotModel
        .find({
          tutorAvailability: slot.tutorAvailability,
          _id: { $ne: slotId },
          $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { startTime: { $gte: startTime, $lte: endTime } },
          ],
        })
        .exec();

      if (overlappingSlots.length > 0) {
        throw new BadRequestException(
          'Updated time slot overlaps with existing slot',
        );
      }

      slot.startTime = startTime;
      slot.endTime = endTime;
    }

    if (dto.meetLink !== undefined) {
      slot.meetLink = dto.meetLink;
    }
    if (dto.isBooked !== undefined) {
      slot.isBooked = dto.isBooked;
    }
    if (dto.type) {
      slot.type = dto.type;
    }
    if (dto.subject) {
      slot.subject = dto.subject;
    }

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
    const slot = await this.timeSlotModel.findOne({
      _id: slotId,
      tutorAvailability: {
        $in: await this.availabilityModel
          .find({ user: new Types.ObjectId(user.userId) })
          .distinct('_id')
          .exec(),
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    if (slot.isBooked) {
      throw new BadRequestException('Cannot delete a booked time slot');
    }

    const deleted = await this.timeSlotModel
      .findOneAndDelete({
        _id: slotId,
        tutorAvailability: {
          $in: await this.availabilityModel
            .find({ user: new Types.ObjectId(user.userId) })
            .distinct('_id')
            .exec(),
        },
      })
      .exec();

    if (!deleted) {
      throw new NotFoundException('Time slot not found');
    }

    return deleted;
  }

  /**
   * Return all available time slots for a given tutor, grouped by date.
   *
   * @param tutorId - ID of the tutor (user)
   * @returns Array of objects with date and corresponding slots
   */
  async getTutorAvailability(tutorId: MongoIdDto['id']) {
    // Only return availability for the running (current) month (UTC)
    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    const startOfNextMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );

    const availability = await this.availabilityModel.aggregate([
      // Match tutor + month
      {
        $match: {
          user: new Types.ObjectId(tutorId),
          date: { $gte: startOfMonth, $lt: startOfNextMonth },
        },
      },

      // Join time slots
      {
        $lookup: {
          from: 'timeslots',
          let: { availabilityId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$tutorAvailability', '$$availabilityId'] }],
                },
              },
            },
            { $sort: { startTime: 1 } },
          ],
          as: 'slots',
        },
      },

      // Format output
      {
        $project: {
          _id: 1,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          slots: 1,
        },
      },

      // Sort by date
      {
        $sort: { date: 1 },
      },
    ]);

    // Add AM/PM labels
    const formatted = availability.map((day) => ({
      availabilityId: day._id,
      date: day.date,
      slots: day.slots.map((s) => ({
        id: s._id,
        type: s.type,
        startTime: s.startTime,
        endTime: s.endTime,
        isBooked: s.isBooked,
        meetLink: s.meetLink,
        subject: s.subject,
        startTimeLabel: formatAmPm(s.startTime, 'Europe/London'),
        endTimeLabel: formatAmPm(s.endTime, 'Europe/London'),
      })),
    }));

    return {
      message: 'Tutor availability retrieved successfully',
      availabilities: formatted,
    };
  }
}
