import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    createBooking(req: any, dto: CreateBookingDto): Promise<import("mongoose").Document<unknown, {}, import("../models/booking.model").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/booking.model").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cancelBooking(bookingId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, import("../models/booking.model").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/booking.model").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    completeBooking(bookingId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, import("../models/booking.model").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/booking.model").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    myBookings(req: any): Promise<import("mongoose").Types.ObjectId[]>;
    mySchedule(req: any): Promise<never[]>;
    bookingDetails(bookingId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, import("../models/booking.model").Booking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/booking.model").Booking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
