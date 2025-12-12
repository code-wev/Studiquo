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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
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
  @Roles(Role.Tutor, Role.Admin)
  create(@Req() req, @Body() createDto: CreateLessonReportDto) {
    // Optionally, you can use req.user for audit or ownership
    return this.lessonReportService.create(createDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  findAll() {
    return this.lessonReportService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  findOne(@Param('id') id: string) {
    return this.lessonReportService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  update(@Param('id') id: string, @Body() updateDto: UpdateLessonReportDto) {
    return this.lessonReportService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.lessonReportService.remove(id);
  }
}
