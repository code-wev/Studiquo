import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoIdDto } from 'common/dto/mongoId.dto';
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
  async addAvailability(
    user: any,
    dto: CreateAvailabilityDto,
  ): Promise<TutorAvailability> {
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

    if (date < startOfMonth || date >= startOfNextMonth) {
      throw new BadRequestException(
        'Only current month availability is allowed',
      );
    }

    const dateOnly = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );

    return this.availabilityModel.create({
      user: user.userId,
      date: dateOnly,
    });
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
    const availability = await this.availabilityModel
      .findById(availabilityId)
      .exec();
    if (!availability) {
      throw new NotFoundException('Availability not found');
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // Validate times
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new BadRequestException('Invalid start or end time');
    }
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for overlapping time slots
    const overlappingSlots = await this.timeSlotModel
      .find({
        tutorAvailability: availabilityId,
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
          { startTime: { $gte: startTime, $lte: endTime } },
        ],
      })
      .exec();

    if (overlappingSlots.length > 0) {
      throw new BadRequestException('Time slot overlaps with existing slot');
    }

    const slot = new this.timeSlotModel({
      tutorAvailability: availabilityId,
      startTime,
      endTime,
      meetLink: dto.meetLink,
    });

    return slot.save();
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
    const deleted = await this.timeSlotModel
      .findOneAndDelete({
        _id: slotId,
        tutorAvailability: {
          $in: await this.availabilityModel
            .find({ user: user.userId })
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
                  $and: [
                    { $eq: ['$tutorAvailability', '$$availabilityId'] },
                    { $ne: ['$isBooked', true] },
                  ],
                },
              },
            },
            { $sort: { startTime: 1 } },
          ],
          as: 'slots',
        },
      },

      // Remove empty days
      {
        $match: {
          'slots.0': { $exists: true },
        },
      },

      // Format output
      {
        $project: {
          _id: 0,
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

    return {
      message: 'Tutor availability retrieved successfully',
      availability,
    };
  }
}
