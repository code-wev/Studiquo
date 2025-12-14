import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { TimeSlot } from '../models/timeSlot.model';
import { TutorAvailability } from '../models/tutorAvailability.model';
import { CreateAvailabilityDto, CreateTimeSlotDto, UpdateTimeSlotDto } from './dto/availability.dto';
interface AuthRequest {
    user: {
        sub: string;
    };
}
export declare class AvailabilityService {
    private availabilityModel;
    private timeSlotModel;
    constructor(availabilityModel: Model<TutorAvailability>, timeSlotModel: Model<TimeSlot>);
    addAvailability(req: AuthRequest, dto: CreateAvailabilityDto): Promise<TutorAvailability>;
    addTimeSlot(availabilityId: MongoIdDto['id'], dto: CreateTimeSlotDto): Promise<TimeSlot>;
    addTimeSlotForTutor(req: AuthRequest, dto: CreateTimeSlotDto): Promise<TimeSlot>;
    updateSlot(req: {
        user: {
            sub: string;
        };
    }, slotId: MongoIdDto['id'], dto: UpdateTimeSlotDto): Promise<TimeSlot>;
    deleteSlot(req: {
        user: {
            sub: string;
        };
    }, slotId: MongoIdDto['id']): Promise<TimeSlot>;
    getTutorAvailability(tutorId: MongoIdDto['id']): Promise<Array<{
        date: string;
        slots: TimeSlot[];
    }>>;
}
export {};
