"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const helpers_1 = require("../common/helpers");
const booking_model_1 = require("../models/booking.model");
const bookingStudents_model_1 = require("../models/bookingStudents.model");
const lessonReport_model_1 = require("../models/lessonReport.model");
let BookingsService = class BookingsService {
    bookingModel;
    bookingStudentsModel;
    lessonReportModel;
    constructor(bookingModel, bookingStudentsModel, lessonReportModel) {
        this.bookingModel = bookingModel;
        this.bookingStudentsModel = bookingStudentsModel;
        this.lessonReportModel = lessonReportModel;
    }
    async createBooking(req, dto) {
        const booking = new this.bookingModel({ ...dto, status: 'SCHEDULED' });
        await booking.save();
        const bookingStudent = new this.bookingStudentsModel({
            booking: booking._id,
            student: (0, helpers_1.getUserSub)(req),
        });
        await bookingStudent.save();
        await this.lessonReportModel.create({
            booking: booking._id,
            description: '',
            dueDate: new Date(),
            submitted: false,
        });
        return booking;
    }
    async updateBookingStatus(bookingId, status) {
        return this.bookingModel.findByIdAndUpdate(bookingId, { status }, { new: true });
    }
    async getMyBookings(req) {
        const bookings = await this.bookingStudentsModel
            .find({ student: (0, helpers_1.getUserSub)(req) })
            .populate('booking');
        return bookings.map((b) => b.booking);
    }
    async getMySchedule(user) {
        return [];
    }
    async getBookingDetails(bookingId) {
        return this.bookingModel.findById(bookingId);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_model_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(bookingStudents_model_1.BookingStudents.name)),
    __param(2, (0, mongoose_1.InjectModel)(lessonReport_model_1.LessonReport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map