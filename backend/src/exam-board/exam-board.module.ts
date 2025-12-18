import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExamBoardEntry,
  ExamBoardEntrySchema,
} from 'src/models/ExamBoardModel';
import {
  StudentProfile,
  StudentProfileSchema,
} from 'src/models/studentProfile.model';
import { ExamBoardController } from './exam-board.controller';
import { ExamBoardService } from './exam-board.service';

/**
 * ExamBoard feature module.
 *
 * Manages exam board entries for students.
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
