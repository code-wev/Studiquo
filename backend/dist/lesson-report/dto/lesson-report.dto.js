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
exports.UpdateLessonReportDto = exports.CreateLessonReportDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLessonReportDto {
    booking;
    description;
    dueDate;
    submitted;
}
exports.CreateLessonReportDto = CreateLessonReportDto;
__decorate([
    (0, class_validator_1.IsMongoId)({ message: 'Booking id must be a valid Mongo id' }),
    __metadata("design:type", String)
], CreateLessonReportDto.prototype, "booking", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Description is required' }),
    __metadata("design:type", String)
], CreateLessonReportDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)({
        message: 'Due date is required and must be a valid date string',
    }),
    __metadata("design:type", Date)
], CreateLessonReportDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Submitted must be a boolean' }),
    __metadata("design:type", Boolean)
], CreateLessonReportDto.prototype, "submitted", void 0);
class UpdateLessonReportDto {
    booking;
    description;
    dueDate;
    submitted;
}
exports.UpdateLessonReportDto = UpdateLessonReportDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)({ message: 'Booking id must be a valid Mongo id' }),
    __metadata("design:type", String)
], UpdateLessonReportDto.prototype, "booking", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Description must be a string' }),
    __metadata("design:type", String)
], UpdateLessonReportDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], UpdateLessonReportDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Submitted must be a boolean' }),
    __metadata("design:type", Boolean)
], UpdateLessonReportDto.prototype, "submitted", void 0);
//# sourceMappingURL=lesson-report.dto.js.map