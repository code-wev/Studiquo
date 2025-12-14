import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getUsers(): Promise<(import("mongoose").Document<unknown, {}, import("../models/user.model").User, {}, import("mongoose").DefaultSchemaOptions> & import("../models/user.model").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getBookings(): Promise<(import("mongoose").Document<unknown, {}, import("../models/booking.model").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/booking.model").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPayments(): Promise<(import("mongoose").Document<unknown, {}, import("../models/payment.model").Payment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/payment.model").Payment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPayouts(): Promise<(import("mongoose").Document<unknown, {}, import("../models/payout.model").Payout, {}, import("mongoose").DefaultSchemaOptions> & import("../models/payout.model").Payout & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    approvePayout(payoutId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, import("../models/payout.model").Payout, {}, import("mongoose").DefaultSchemaOptions> & import("../models/payout.model").Payout & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    rejectPayout(payoutId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, import("../models/payout.model").Payout, {}, import("mongoose").DefaultSchemaOptions> & import("../models/payout.model").Payout & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    verifyTutor(tutorId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, import("../models/tutorProfile.model").TutorProfile, {}, import("mongoose").DefaultSchemaOptions> & import("../models/tutorProfile.model").TutorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
