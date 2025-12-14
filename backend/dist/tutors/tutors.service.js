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
exports.TutorsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_model_1 = require("../models/review.model");
const tutorProfile_model_1 = require("../models/tutorProfile.model");
const user_model_1 = require("../models/user.model");
let TutorsService = class TutorsService {
    tutorProfileModel;
    userModel;
    reviewModel;
    constructor(tutorProfileModel, userModel, reviewModel) {
        this.tutorProfileModel = tutorProfileModel;
        this.userModel = userModel;
        this.reviewModel = reviewModel;
    }
    async searchTutors(query) {
        const tutorFilter = {};
        const userFilter = {};
        if (query.subject) {
            tutorFilter.subjects = query.subject;
        }
        if (query.maxHourlyRate !== undefined) {
            tutorFilter.hourlyRate = { $lte: query.maxHourlyRate };
        }
        if (query.minRating !== undefined) {
            tutorFilter.rating = { $gte: query.minRating };
        }
        if (query.firstName) {
            userFilter.firstName = { $regex: query.firstName, $options: 'i' };
        }
        if (query.lastName) {
            userFilter.lastName = { $regex: query.lastName, $options: 'i' };
        }
        if (query.bio) {
            userFilter.bio = { $regex: query.bio, $options: 'i' };
        }
        return this.tutorProfileModel
            .find(tutorFilter)
            .populate({
            path: 'user',
            match: userFilter,
            select: 'firstName lastName avatar bio',
        })
            .exec();
    }
    async getPublicProfile(tutorId) {
        const tutorProfile = await this.tutorProfileModel
            .findById(tutorId)
            .populate({
            path: 'user',
            select: 'firstName lastName avatar bio role',
        })
            .lean();
        if (!tutorProfile) {
            throw new common_1.NotFoundException('Tutor profile not found');
        }
        return {
            id: tutorProfile._id,
            subjects: tutorProfile.subjects,
            hourlyRate: tutorProfile.hourlyRate,
            user: tutorProfile.user,
        };
    }
    async getTutorReviews(tutorId, query) {
        const { page = 1, limit = 10, rating } = query;
        const filter = { tutor: tutorId };
        if (rating) {
            filter.rating = rating;
        }
        const skip = (page - 1) * limit;
        const [reviews, total] = await Promise.all([
            this.reviewModel
                .find(filter)
                .populate('student', 'firstName lastName avatar')
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.reviewModel.countDocuments(filter),
        ]);
        return {
            data: reviews,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.TutorsService = TutorsService;
exports.TutorsService = TutorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tutorProfile_model_1.TutorProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(review_model_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TutorsService);
//# sourceMappingURL=tutors.service.js.map