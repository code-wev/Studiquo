import { Controller, Get, Param, Query } from '@nestjs/common';
import { TutorsService } from './tutors.service';

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

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
