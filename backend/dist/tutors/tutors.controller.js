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
exports.TutorsController = void 0;
const common_1 = require("@nestjs/common");
const availability_service_1 = require("../availability/availability.service");
const mongoId_dto_1 = require("../common/dto/mongoId.dto");
const review_dto_1 = require("../reviews/dto/review.dto");
const tutor_dto_1 = require("./dto/tutor.dto");
const tutors_service_1 = require("./tutors.service");
let TutorsController = class TutorsController {
    tutorsService;
    availabilityService;
    constructor(tutorsService, availabilityService) {
        this.tutorsService = tutorsService;
        this.availabilityService = availabilityService;
    }
    async searchTutors(query) {
        return this.tutorsService.searchTutors(query);
    }
    async publicProfile(tutorId) {
        return this.tutorsService.getPublicProfile(tutorId);
    }
    async tutorReviews(params, query) {
        return this.tutorsService.getTutorReviews(params.id, query);
    }
    async tutorAvailability(tutorId) {
        return this.availabilityService.getTutorAvailability(tutorId);
    }
};
exports.TutorsController = TutorsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tutor_dto_1.TutorSearchQueryDto]),
    __metadata("design:returntype", Promise)
], TutorsController.prototype, "searchTutors", null);
__decorate([
    (0, common_1.Get)(':tutorId'),
    __param(0, (0, common_1.Param)('tutorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TutorsController.prototype, "publicProfile", null);
__decorate([
    (0, common_1.Get)(':tutorId/reviews'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoId_dto_1.MongoIdDto,
        review_dto_1.ReviewQueryDto]),
    __metadata("design:returntype", Promise)
], TutorsController.prototype, "tutorReviews", null);
__decorate([
    (0, common_1.Get)(':tutorId/availability'),
    __param(0, (0, common_1.Param)('tutorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TutorsController.prototype, "tutorAvailability", null);
exports.TutorsController = TutorsController = __decorate([
    (0, common_1.Controller)('tutors'),
    __metadata("design:paramtypes", [tutors_service_1.TutorsService,
        availability_service_1.AvailabilityService])
], TutorsController);
//# sourceMappingURL=tutors.controller.js.map