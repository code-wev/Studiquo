import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../models/User.model';
import { LessonReportService } from './lesson-report.service';

@Controller('lesson-reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonReportController {
  constructor(private readonly lessonReportService: LessonReportService) {}

  @Post()
  @Roles(UserRole.Tutor, UserRole.Admin)
  create(@Body() body) {
    return console.log(`
      body received in lesson-report controller: ${JSON.stringify(body)}
    `);
  }

  @Get()
  @Roles(UserRole.Tutor, UserRole.Admin)
  findAll() {
    return console.log('');
  }

  @Get(':id')
  @Roles(UserRole.Tutor, UserRole.Admin)
  findOne(@Param('id') id: MongoIdDto['id']) {
    return console.log('');
  }

  @Patch(':id')
  @Roles(UserRole.Tutor, UserRole.Admin)
  update(@Param('id') id: MongoIdDto['id'], @Body() body) {
    return console.log('');
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  remove(@Param('id') id: MongoIdDto['id']) {
    return console.log('');
  }
}
