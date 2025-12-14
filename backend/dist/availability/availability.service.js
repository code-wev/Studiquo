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
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const helpers_1 = require("../common/helpers");
const timeSlot_model_1 = require("../models/timeSlot.model");
const tutorAvailability_model_1 = require("../models/tutorAvailability.model");
let AvailabilityService = class AvailabilityService {
    availabilityModel;
    timeSlotModel;
    constructor(availabilityModel, timeSlotModel) {
        this.availabilityModel = availabilityModel;
        this.timeSlotModel = timeSlotModel;
    }
    async addAvailability(req, dto) {
        const date = new Date(dto.date);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
        if (date < startOfMonth || date >= startOfNextMonth) {
            throw new common_1.BadRequestException('Only current month availability is allowed');
        }
        const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        return this.availabilityModel.create({
            user: (0, helpers_1.getUserSub)(req),
            date: dateOnly,
        });
    }
    async addTimeSlot(availabilityId, dto) {
        const availability = await this.availabilityModel
            .findById(availabilityId)
            .exec();
        if (!availability) {
            throw new common_1.NotFoundException('Availability not found');
        }
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            throw new common_1.BadRequestException('Invalid start or end time');
        }
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        const overlappingSlots = await this.timeSlotModel
            .find({
            tutorAvailability: availabilityId,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $gte: startTime, $lte: endTime } },
            ],
        })
            .exec();
        if (overlappingSlots.length > 0) {
            throw new common_1.BadRequestException('Time slot overlaps with existing slot');
        }
        const slot = new this.timeSlotModel({
            tutorAvailability: availabilityId,
            startTime,
            endTime,
            meetLink: dto.meetLink,
        });
        return slot.save();
    }
    async addTimeSlotForTutor(req, dto) {
        const userId = (0, helpers_1.getUserSub)(req);
        const startTime = new Date(dto.startTime);
        const endTime = new Date(dto.endTime);
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            throw new common_1.BadRequestException('Invalid start or end time');
        }
        if (startTime >= endTime) {
            throw new common_1.BadRequestException('Start time must be before end time');
        }
        const dateOnly = new Date(Date.UTC(startTime.getUTCFullYear(), startTime.getUTCMonth(), startTime.getUTCDate()));
        let availability = await this.availabilityModel
            .findOne({ user: userId, date: dateOnly })
            .exec();
        if (!availability) {
            availability = await this.availabilityModel.create({
                user: userId,
                date: dateOnly,
            });
        }
        const overlappingSlots = await this.timeSlotModel
            .find({
            tutorAvailability: availability._id,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $gte: startTime, $lte: endTime } },
            ],
        })
            .exec();
        if (overlappingSlots.length > 0) {
            throw new common_1.BadRequestException('Time slot overlaps with existing slot');
        }
        const slot = new this.timeSlotModel({
            tutorAvailability: availability._id,
            startTime,
            endTime,
            meetLink: dto.meetLink,
        });
        return slot.save();
    }
    async updateSlot(req, slotId, dto) {
        const slot = await this.timeSlotModel
            .findOne({
            _id: slotId,
            tutorAvailability: {
                $in: await this.availabilityModel
                    .find({ user: req.user.sub })
                    .distinct('_id')
                    .exec(),
            },
        })
            .exec();
        if (!slot) {
            throw new common_1.NotFoundException('Time slot not found');
        }
        if (dto.startTime || dto.endTime) {
            const startTime = dto.startTime
                ? new Date(dto.startTime)
                : slot.startTime;
            const endTime = dto.endTime ? new Date(dto.endTime) : slot.endTime;
            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                throw new common_1.BadRequestException('Invalid start or end time');
            }
            if (startTime >= endTime) {
                throw new common_1.BadRequestException('Start time must be before end time');
            }
            const overlappingSlots = await this.timeSlotModel
                .find({
                tutorAvailability: slot.tutorAvailability,
                _id: { $ne: slotId },
                $or: [
                    { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                    { startTime: { $gte: startTime, $lte: endTime } },
                ],
            })
                .exec();
            if (overlappingSlots.length > 0) {
                throw new common_1.BadRequestException('Updated time slot overlaps with existing slot');
            }
            slot.startTime = startTime;
            slot.endTime = endTime;
        }
        if (dto.meetLink !== undefined) {
            slot.meetLink = dto.meetLink;
        }
        if (dto.isBooked !== undefined) {
            slot.isBooked = dto.isBooked;
        }
        return slot.save();
    }
    async deleteSlot(req, slotId) {
        const deleted = await this.timeSlotModel
            .findOneAndDelete({
            _id: slotId,
            tutorAvailability: {
                $in: await this.availabilityModel
                    .find({ user: req.user.sub })
                    .distinct('_id')
                    .exec(),
            },
        })
            .exec();
        if (!deleted) {
            throw new common_1.NotFoundException('Time slot not found');
        }
        return deleted;
    }
    async getTutorAvailability(tutorId) {
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
        const availabilities = await this.availabilityModel
            .find({
            user: tutorId,
            date: { $gte: startOfMonth, $lt: startOfNextMonth },
        })
            .lean()
            .exec();
        if (!availabilities.length) {
            return [];
        }
        const availIds = availabilities.map((a) => a._id);
        const slots = await this.timeSlotModel
            .find({
            tutorAvailability: { $in: availIds },
            isBooked: { $ne: true },
            startTime: { $gte: startOfMonth, $lt: startOfNextMonth },
        })
            .sort({ startTime: 1 })
            .lean()
            .exec();
        const byDate = {};
        for (const a of availabilities) {
            const key = new Date(a.date).toISOString().slice(0, 10);
            byDate[key] = [];
        }
        for (const s of slots) {
            const parent = availabilities.find((a) => a._id.toString() === s.tutorAvailability.toString());
            const key = parent
                ? new Date(parent.date).toISOString().slice(0, 10)
                : new Date(s.startTime).toISOString().slice(0, 10);
            byDate[key] = byDate[key] || [];
            byDate[key].push(s);
        }
        return Object.keys(byDate)
            .sort()
            .map((date) => ({ date, slots: byDate[date] }));
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tutorAvailability_model_1.TutorAvailability.name)),
    __param(1, (0, mongoose_1.InjectModel)(timeSlot_model_1.TimeSlot.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AvailabilityService);
//# sourceMappingURL=availability.service.js.map