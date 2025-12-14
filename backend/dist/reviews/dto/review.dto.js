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
exports.ReviewQueryDto = exports.CreateReviewDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
class CreateReviewDto {
    booking;
    tutor;
    rating;
    comment;
}
exports.CreateReviewDto = CreateReviewDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "booking", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "tutor", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Rating must be a number between 1 and 5' }),
    (0, class_validator_1.Min)(1, { message: 'Rating must be at least 1' }),
    (0, class_validator_1.Max)(5, { message: 'Rating cannot be greater than 5' }),
    __metadata("design:type", Number)
], CreateReviewDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Comment must be a string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Comment is required' }),
    (0, class_validator_1.MinLength)(1, { message: 'Comment must contain at least 1 character' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Comment cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateReviewDto.prototype, "comment", void 0);
class ReviewQueryDto extends pagination_dto_1.PaginationDto {
    rating;
}
exports.ReviewQueryDto = ReviewQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ReviewQueryDto.prototype, "rating", void 0);
//# sourceMappingURL=review.dto.js.map