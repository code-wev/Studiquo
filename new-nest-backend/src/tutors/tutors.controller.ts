import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  CreateTutorProfileDto,
  UpdateTutorProfileDto,
} from './dto/tutor-profile.dto';
import { TutorsService } from './tutors.service';

@Controller('api/tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async createProfile(@Req() req, @Body() dto: CreateTutorProfileDto) {
    return this.tutorsService.createProfile(req.user, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async myProfile(@Req() req) {
    return this.tutorsService.getMyProfile(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Tutor, Role.Admin)
  async updateMyProfile(@Req() req, @Body() dto: UpdateTutorProfileDto) {
    return this.tutorsService.updateMyProfile(req.user, dto);
  }

  @Get()
  async searchTutors(@Query() query) {
    return this.tutorsService.searchTutors(query);
  }

  @Get(':tutorId')
  async publicProfile(@Param('tutorId') tutorId: string) {
    return this.tutorsService.getPublicProfile(tutorId);
  }

  @Get(':tutorId/reviews')
  async tutorReviews(@Param('tutorId') tutorId: string) {
    return this.tutorsService.getTutorReviews(tutorId);
  }
}
