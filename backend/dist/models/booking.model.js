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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = exports.Booking = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Booking = class Booking extends mongoose_2.Document {
    timeSlot;
    subject;
    type;
    date;
    status;
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'TimeSlot', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "timeSlot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['MATH', 'SCIENCE', 'ENGLISH'] }),
    __metadata("design:type", String)
], Booking.prototype, "subject", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['ONE_TO_ONE', 'GROUP'], default: 'GROUP' }),
    __metadata("design:type", String)
], Booking.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['SCHEDULED', 'CANCELLED', 'COMPLETED'] }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)()
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.model.js.map