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
exports.TutorSearchQueryDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TutorSearchQueryDto {
    subject;
    maxHourlyRate;
    minRating;
    firstName;
    lastName;
    bio;
}
exports.TutorSearchQueryDto = TutorSearchQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Subject must be a string' }),
    (0, class_validator_1.IsEnum)(['MATH', 'SCIENCE', 'ENGLISH'], {
        message: 'Subject must be one of MATH | SCIENCE | ENGLISH',
    }),
    __metadata("design:type", String)
], TutorSearchQueryDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Maximum hourly rate must be a number' }),
    __metadata("design:type", Number)
], TutorSearchQueryDto.prototype, "maxHourlyRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Minimum tutor rating must be a number' }),
    __metadata("design:type", Number)
], TutorSearchQueryDto.prototype, "minRating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    __metadata("design:type", String)
], TutorSearchQueryDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string' }),
    __metadata("design:type", String)
], TutorSearchQueryDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Bio must be a string' }),
    __metadata("design:type", String)
], TutorSearchQueryDto.prototype, "bio", void 0);
//# sourceMappingURL=tutor.dto.js.map