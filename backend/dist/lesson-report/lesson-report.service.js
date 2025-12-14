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
exports.LessonReportService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lessonReport_model_1 = require("../models/lessonReport.model");
let LessonReportService = class LessonReportService {
    lessonReportModel;
    constructor(lessonReportModel) {
        this.lessonReportModel = lessonReportModel;
    }
    async create(createDto) {
        return this.lessonReportModel.create(createDto);
    }
    async findAll() {
        return this.lessonReportModel.find().populate('booking').exec();
    }
    async findOne(id) {
        const report = await this.lessonReportModel
            .findById(id)
            .populate('booking')
            .exec();
        if (!report)
            throw new common_1.NotFoundException('Lesson report not found');
        return report;
    }
    async update(id, updateDto) {
        const report = await this.lessonReportModel.findByIdAndUpdate(id, updateDto, { new: true });
        if (!report)
            throw new common_1.NotFoundException('Lesson report not found');
        return report;
    }
    async remove(id) {
        const result = await this.lessonReportModel.findByIdAndDelete(id);
        if (!result)
            throw new common_1.NotFoundException('Lesson report not found');
    }
};
exports.LessonReportService = LessonReportService;
exports.LessonReportService = LessonReportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lessonReport_model_1.LessonReport.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LessonReportService);
//# sourceMappingURL=lesson-report.service.js.map