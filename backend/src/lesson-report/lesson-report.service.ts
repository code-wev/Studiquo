import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { LessonReport } from '../models/LessonReport.model';

@Injectable()
export class LessonReportService {
  constructor(
    @InjectModel(LessonReport.name)
    private lessonReportModel: Model<LessonReport>,
  ) {}

  async create() {}

  async findAll() {}

  async findOne(id: MongoIdDto['id']) {}

  async update(id: MongoIdDto['id']) {}

  async remove(id: MongoIdDto['id']) {}
}
