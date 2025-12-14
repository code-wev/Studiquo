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
exports.UpdateTimeSlotDto = exports.CreateTimeSlotDto = exports.CreateAvailabilityDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAvailabilityDto {
    date;
}
exports.CreateAvailabilityDto = CreateAvailabilityDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Date must be a valid ISO date string (e.g., 2025-12-14)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Date is required' }),
    __metadata("design:type", String)
], CreateAvailabilityDto.prototype, "date", void 0);
class CreateTimeSlotDto {
    startTime;
    endTime;
    meetLink;
}
exports.CreateTimeSlotDto = CreateTimeSlotDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'startTime must be a valid ISO datetime string' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'endTime must be a valid ISO datetime string' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'meetLink must be a valid URL' }),
    __metadata("design:type", String)
], CreateTimeSlotDto.prototype, "meetLink", void 0);
class UpdateTimeSlotDto {
    startTime;
    endTime;
    meetLink;
    isBooked;
}
exports.UpdateTimeSlotDto = UpdateTimeSlotDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'startTime must be a valid ISO datetime string' }),
    __metadata("design:type", String)
], UpdateTimeSlotDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'endTime must be a valid ISO datetime string' }),
    __metadata("design:type", String)
], UpdateTimeSlotDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'meetLink must be a valid URL' }),
    __metadata("design:type", String)
], UpdateTimeSlotDto.prototype, "meetLink", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isBooked must be a boolean' }),
    __metadata("design:type", Boolean)
], UpdateTimeSlotDto.prototype, "isBooked", void 0);
//# sourceMappingURL=availability.dto.js.map