import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { CreateLessonReportDto, UpdateLessonReportDto } from './dto/lesson-report.dto';
import { LessonReportService } from './lesson-report.service';
export declare class LessonReportController {
    private readonly lessonReportService;
    constructor(lessonReportService: LessonReportService);
    create(req: any, createDto: CreateLessonReportDto): Promise<import("../models/lessonReport.model").LessonReport>;
    findAll(): Promise<import("../models/lessonReport.model").LessonReport[]>;
    findOne(id: MongoIdDto['id']): Promise<import("../models/lessonReport.model").LessonReport>;
    update(id: MongoIdDto['id'], updateDto: UpdateLessonReportDto): Promise<import("../models/lessonReport.model").LessonReport>;
    remove(id: MongoIdDto['id']): Promise<void>;
}
