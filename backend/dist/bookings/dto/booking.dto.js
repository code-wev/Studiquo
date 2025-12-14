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
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
class CreateBookingDto {
    timeSlot;
    subject;
    date;
    type;
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Time slot id must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Time slot is required' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "timeSlot", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Subject must be a string' }),
    (0, class_validator_1.IsEnum)(['MATH', 'SCIENCE', 'ENGLISH'], {
        message: 'Subject must be one of MATH|SCIENCE|ENGLISH',
    }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Date is required and must be a valid date string' }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Type must be a string' }),
    (0, class_validator_1.IsEnum)(['ONE_TO_ONE', 'GROUP'], {
        message: 'Type must be ONE_TO_ONE or GROUP',
    }),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "type", void 0);
//# sourceMappingURL=booking.dto.js.map