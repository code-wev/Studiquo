import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'common/decorators/get-user.decorator';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateExamBoardDto } from './dto/exam-board.dto';
import { ExamBoardService } from './exam-board.service';

/**
 * Controller for managing exam board entries for students.
 *
 * Routes are prefixed with `/exam-board` and protected using JWT and
 * role-based guards.
 */
@Controller('exam-board')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Student)
export class ExamBoardController {
  constructor(private readonly examBoardService: ExamBoardService) {}

  /**
   * Add an exam board entry for the authenticated student.
   *
   * @param user - the authenticated user
   * @param dto - the exam board data
   * @returns the updated student profile
   */
  @Post('')
  async addExamBoard(@GetUser() user: any, @Body() dto: CreateExamBoardDto) {
    return this.examBoardService.addOrUpdateExamBoard(user.sub, dto);
  }

  /**
   * Get all exam board entries for the authenticated student.
   *
   * @param user - the authenticated user
   * @returns the list of exam boards
   */
  @Get()
  async getExamBoards(@GetUser() user: any) {
    return this.examBoardService.getExamBoards(user.userId);
  }
}
