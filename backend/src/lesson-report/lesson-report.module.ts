import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonReport, LessonReportSchema } from '../models/LessonReport.model';
import { LessonReportController } from './lesson-report.controller';
import { LessonReportService } from './lesson-report.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LessonReport.name, schema: LessonReportSchema },
    ]),
  ],
  controllers: [LessonReportController],
  providers: [LessonReportService],
  exports: [LessonReportService],
})
export class LessonReportModule {}
