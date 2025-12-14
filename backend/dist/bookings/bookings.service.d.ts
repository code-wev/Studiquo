import { Model } from 'mongoose';
import { Booking } from '../models/booking.model';
import { BookingStudents } from '../models/bookingStudents.model';
import { LessonReport } from '../models/lessonReport.model';
import { CreateBookingDto } from './dto/booking.dto';
export declare class BookingsService {
    private bookingModel;
    private bookingStudentsModel;
    private lessonReportModel;
    constructor(bookingModel: Model<Booking>, bookingStudentsModel: Model<BookingStudents>, lessonReportModel: Model<LessonReport>);
    createBooking(req: {
        user: any;
    }, dto: CreateBookingDto): Promise<import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateBookingStatus(bookingId: string, status: string): Promise<(import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getMyBookings(req: {
        user: any;
    }): Promise<import("mongoose").Types.ObjectId[]>;
    getMySchedule(user: any): Promise<never[]>;
    getBookingDetails(bookingId: string): Promise<(import("mongoose").Document<unknown, {}, Booking, {}, import("mongoose").DefaultSchemaOptions> & Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
