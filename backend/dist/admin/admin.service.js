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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_model_1 = require("../models/booking.model");
const payment_model_1 = require("../models/payment.model");
const payout_model_1 = require("../models/payout.model");
const tutorProfile_model_1 = require("../models/tutorProfile.model");
const user_model_1 = require("../models/user.model");
let AdminService = class AdminService {
    userModel;
    bookingModel;
    paymentModel;
    payoutModel;
    tutorProfileModel;
    constructor(userModel, bookingModel, paymentModel, payoutModel, tutorProfileModel) {
        this.userModel = userModel;
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.payoutModel = payoutModel;
        this.tutorProfileModel = tutorProfileModel;
    }
    async getUsers() {
        return this.userModel.find();
    }
    async getBookings() {
        return this.bookingModel.find();
    }
    async getPayments() {
        return this.paymentModel.find();
    }
    async getPayouts() {
        return this.payoutModel.find();
    }
    async updatePayoutStatus(payoutId, status) {
        return this.payoutModel.findByIdAndUpdate(payoutId, { status }, { new: true });
    }
    async verifyTutor(tutorId) {
        return this.tutorProfileModel.findByIdAndUpdate(tutorId, { verified: true }, { new: true });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_model_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(payment_model_1.Payment.name)),
    __param(3, (0, mongoose_1.InjectModel)(payout_model_1.Payout.name)),
    __param(4, (0, mongoose_1.InjectModel)(tutorProfile_model_1.TutorProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map