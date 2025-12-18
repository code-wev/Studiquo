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
    let profile = await this.studentProfileModel.findOne({ user: userId });
    if (!profile) {
      profile = new this.studentProfileModel({
        user: new Types.ObjectId(userId),
      });
    }
    const existingEntryIndex = profile.examBoards.findIndex(
      (entry) => entry.subject === dto.subject,
    );
    if (existingEntryIndex >= 0) {
      // Update existing entry
      profile.examBoards[existingEntryIndex].board = dto.board;
    } else {
      // Add new entry
      profile.examBoards.push(
        new this.examBoardEntryModel({
          subject: dto.subject,
          board: dto.board,
        }),
      );
    }
    await profile.save();
    return {
      message: 'Exam board entry added/updated successfully',
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
    const profile = await this.studentProfileModel.findOne({ user: userId });
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    return {
      message: 'Exam board entries retrieved successfully',
      boards: profile.examBoards,
    };
  }
}
