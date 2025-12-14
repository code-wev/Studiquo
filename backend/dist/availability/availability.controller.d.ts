import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto, CreateTimeSlotDto, UpdateTimeSlotDto } from './dto/availability.dto';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    addAvailability(req: any, dto: CreateAvailabilityDto): Promise<import("../models/tutorAvailability.model").TutorAvailability>;
    addTimeSlotForTutor(req: any, dto: CreateTimeSlotDto): Promise<import("../models/timeSlot.model").TimeSlot>;
    addTimeSlot(availabilityId: MongoIdDto['id'], dto: CreateTimeSlotDto): Promise<import("../models/timeSlot.model").TimeSlot>;
    updateSlot(req: any, slotId: MongoIdDto['id'], dto: UpdateTimeSlotDto): Promise<import("../models/timeSlot.model").TimeSlot>;
    deleteSlot(req: any, slotId: MongoIdDto['id']): Promise<import("../models/timeSlot.model").TimeSlot>;
}
