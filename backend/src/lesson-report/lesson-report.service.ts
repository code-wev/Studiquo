import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { LessonReport } from '../models/lessonReport.model';
import {
  CreateLessonReportDto,
  UpdateLessonReportDto,
} from './dto/lesson-report.dto';

@Injectable()
export class LessonReportService {
  constructor(
    @InjectModel(LessonReport.name)
    private lessonReportModel: Model<LessonReport>,
  ) {}

  async create(createDto: CreateLessonReportDto): Promise<LessonReport> {
    return this.lessonReportModel.create(createDto);
  }

  async findAll(): Promise<LessonReport[]> {
    return this.lessonReportModel.find().populate('booking').exec();
  }

  async findOne(id: MongoIdDto['id']): Promise<LessonReport> {
    const report = await this.lessonReportModel
      .findById(id)
      .populate('booking')
      .exec();
    if (!report) throw new NotFoundException('Lesson report not found');
    return report;
  }

  async update(
    id: MongoIdDto['id'],
    updateDto: UpdateLessonReportDto,
  ): Promise<LessonReport> {
    const report = await this.lessonReportModel.findByIdAndUpdate(
      id,
      updateDto,
      { new: true },
    );
    if (!report) throw new NotFoundException('Lesson report not found');
    return report;
  }

  async remove(id: MongoIdDto['id']): Promise<void> {
    const result = await this.lessonReportModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Lesson report not found');
  }
}
