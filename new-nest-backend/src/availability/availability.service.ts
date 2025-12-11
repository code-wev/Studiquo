import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TimeSlot } from '../models/timeSlot.model';
import { TutorAvailability } from '../models/tutorAvailability.model';
import { getUserSub } from '../common/helpers';
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

  async addAvailability(req: { user: any }, dto: CreateAvailabilityDto) {
    const availability = new this.availabilityModel({
      user: getUserSub(req),
      date: dto.date,
    });
    await availability.save();
    return availability;
  }

  async addTimeSlot(availabilityId: string, dto: CreateTimeSlotDto) {
    const slot = new this.timeSlotModel({
      tutorAvailability: availabilityId,
      ...dto,
    });
    await slot.save();
    return slot;
  }

  async updateSlot(slotId: string, dto: UpdateTimeSlotDto) {
    return this.timeSlotModel.findByIdAndUpdate(slotId, dto, { new: true });
  }

  async deleteSlot(slotId: string) {
    return this.timeSlotModel.findByIdAndDelete(slotId);
  }
}
