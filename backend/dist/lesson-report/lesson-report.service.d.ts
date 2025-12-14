import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { LessonReport } from '../models/lessonReport.model';
import { CreateLessonReportDto, UpdateLessonReportDto } from './dto/lesson-report.dto';
export declare class LessonReportService {
    private lessonReportModel;
    constructor(lessonReportModel: Model<LessonReport>);
    create(createDto: CreateLessonReportDto): Promise<LessonReport>;
    findAll(): Promise<LessonReport[]>;
    findOne(id: MongoIdDto['id']): Promise<LessonReport>;
    update(id: MongoIdDto['id'], updateDto: UpdateLessonReportDto): Promise<LessonReport>;
    remove(id: MongoIdDto['id']): Promise<void>;
}
