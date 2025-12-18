import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamBoardEntry } from 'src/models/ExamBoardModel';
import { StudentProfile } from 'src/models/studentProfile.model';
import { CreateExamBoardDto } from './dto/exam-board.dto';

@Injectable()
export class ExamBoardService {
  constructor(
    @InjectModel(StudentProfile.name)
    private studentProfileModel: Model<StudentProfile>,
    @InjectModel(ExamBoardEntry.name)
    private examBoardEntryModel: Model<ExamBoardEntry>,
  ) {}

  /**
   * Add or update an exam board entry in the student's profile.
   *
   * @param userId - the ID of the user (student)
   * @param dto - the exam board data
   * @returns the updated student profile
   */
  async addOrUpdateExamBoard(userId: string, dto: CreateExamBoardDto) {
    // Try updating existing subject
    const updated = await this.studentProfileModel.findOneAndUpdate(
      {
        user: new Types.ObjectId(userId),
        'examBoards.subject': dto.subject,
      },
      {
        $set: {
          'examBoards.$.board': dto.board,
        },
      },
      { new: true },
    );

    if (updated) {
      return updated; // subject existed → board updated
    }

    //  Subject does not exist → push new entry
    const profile = await this.studentProfileModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      {
        $push: {
          examBoards: {
            subject: dto.subject,
            board: dto.board,
          },
        },
      },
      { new: true },
    );

    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }

    return {
      message: 'Exam board entry added successfully',
      boards: profile.examBoards,
    };
  }

  /**
   * Get all exam board entries for the student.
   *
   * @param userId - the ID of the user (student)
   * @returns the list of exam boards
   */
  async getExamBoards(userId: string) {
    const profile = await this.studentProfileModel
      .findOne({
        user: new Types.ObjectId(userId),
      })
      .select('examBoards');

    return {
      message: 'Exam board entries retrieved successfully',
      boards: profile?.examBoards || [],
    };
  }
}
