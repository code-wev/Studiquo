import { Controller, Get, Param, Query } from '@nestjs/common';
import { AvailabilityService } from 'src/availability/availability.service';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { ReviewQueryDto } from 'src/reviews/dto/review.dto';
import { TutorSearchQueryDto } from './dto/tutor.dto';
import { TutorsService } from './tutors.service';

/**
 * Controller for public tutor endpoints.
 *
 * Exposes searching, public profile retrieval and review listing for tutors.
 */
@Controller('tutors')
export class TutorsController {
  constructor(
    private readonly tutorsService: TutorsService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  /**
   * Search tutors by profile and user fields.
   * Supports filtering by subject, hourly rate and user fields like
   * `firstName`, `lastName`, and `bio`.
   *
   * @param query - validated search query DTO
   * @returns list of tutor profiles matching the search criteria
   */
  @Get()
  async searchTutors(@Query() query: TutorSearchQueryDto) {
    return this.tutorsService.searchTutors(query);
  }

  /**
   * Get a tutor's public profile by their ID.
   *
   * @param tutorId - the MongoDB ID of the tutor
   * @returns the tutor's public profile information
   */
  @Get(':tutorId')
  async publicProfile(@Param('tutorId') tutorId: MongoIdDto['id']) {
    return this.tutorsService.getPublicProfile(tutorId);
  }

  /**
   *  Get reviews for a specific tutor by their ID.
   *
   * @param tutorId - the MongoDB ID of the tutor
   * @param query - query parameters for filtering/pagination
   * @returns list of reviews for the specified tutor
   */
  @Get(':tutorId/reviews')
  async tutorReviews(
    @Param() params: MongoIdDto,
    @Query() query: ReviewQueryDto,
  ) {
    return this.tutorsService.getTutorReviews(params.id, query);
  }

  /**
   * Return a tutor's public availability (available, unbooked slots) grouped by date.
   * GET /api/tutors/:tutorId/availability
   */
  @Get(':tutorId/availability')
  async tutorAvailability(@Param('tutorId') tutorId: MongoIdDto['id']) {
    return this.availabilityService.getTutorAvailability(tutorId);
  }
}
