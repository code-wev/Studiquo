import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamBoardEntry, ExamBoardEntrySchema } from '../models/ExamBoardModel';
import {
  StudentProfile,
  StudentProfileSchema,
} from '../models/StudentProfile.model';
import { ExamBoardController } from './exam-board.controller';
import { ExamBoardService } from './exam-board.service';

/**
 * Exam Board feature module.
 *
 * Registers the `ExamBoardEntry` and `StudentProfile` schemas and
 * exposes the `ExamBoardService` and `ExamBoardController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentProfile.name, schema: StudentProfileSchema },
      { name: ExamBoardEntry.name, schema: ExamBoardEntrySchema },
    ]),
  ],
  controllers: [ExamBoardController],
  providers: [ExamBoardService],
  exports: [ExamBoardService],
})
export class ExamBoardModule {}
