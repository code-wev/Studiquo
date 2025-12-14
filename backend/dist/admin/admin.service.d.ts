import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { Booking } from '../models/booking.model';
import { Payment } from '../models/payment.model';
import { Payout } from '../models/payout.model';
import { TutorProfile } from '../models/tutorProfile.model';
import { User } from '../models/user.model';
export declare class AdminService {
    private userModel;
    private bookingModel;
    private paymentModel;
    private payoutModel;
    private tutorProfileModel;
    constructor(userModel: Model<User>, bookingModel: Model<Booking>, paymentModel: Model<Payment>, payoutModel: Model<Payout>, tutorProfileModel: Model<TutorProfile>);
    getUsers(): Promise<(import("mongoose").Document<unknown, {}, User, {}, import("mongoose").DefaultSchemaOptions> & User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getBookings(): Promise<(import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPayments(): Promise<(import("mongoose").Document<unknown, {}, Payment, {}, import("mongoose").DefaultSchemaOptions> & Payment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPayouts(): Promise<(import("mongoose").Document<unknown, {}, Payout, {}, import("mongoose").DefaultSchemaOptions> & Payout & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updatePayoutStatus(payoutId: MongoIdDto['id'], status: string): Promise<(import("mongoose").Document<unknown, {}, Payout, {}, import("mongoose").DefaultSchemaOptions> & Payout & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    verifyTutor(tutorId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, TutorProfile, {}, import("mongoose").DefaultSchemaOptions> & TutorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
