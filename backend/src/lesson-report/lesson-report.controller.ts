import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateLessonReportDto,
  UpdateLessonReportDto,
} from './dto/lesson-report.dto';
import { LessonReportService } from './lesson-report.service';

@Controller('lesson-reports')
export class LessonReportController {
  constructor(private readonly lessonReportService: LessonReportService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor, UserRole.Admin)
  create(@Req() req, @Body() createDto: CreateLessonReportDto) {
    // Optionally, you can use req.user for audit or ownership
    return this.lessonReportService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor, UserRole.Admin)
  findAll() {
    return this.lessonReportService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor, UserRole.Admin)
  findOne(@Param('id') id: MongoIdDto['id']) {
    return this.lessonReportService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor, UserRole.Admin)
  update(
    @Param('id') id: MongoIdDto['id'],
    @Body() updateDto: UpdateLessonReportDto,
  ) {
    return this.lessonReportService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  remove(@Param('id') id: MongoIdDto['id']) {
    return this.lessonReportService.remove(id);
  }
}
