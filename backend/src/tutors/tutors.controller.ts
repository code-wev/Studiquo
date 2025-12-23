import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AvailabilityService } from '../availability/availability.service';
import { UserRole } from '../models/User.model';
import { ReviewQueryDto } from '../reviews/dto/review.dto';
import { PaymentRequestDto, TutorSearchPaginationDto } from './dto/tutor.dto';
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
  async searchTutors(@Query() query: TutorSearchPaginationDto) {
    return this.tutorsService.searchTutors(query);
  }

  /**
   * Get an overview of tutors including statistics like total classes, students and average total board.
   *
   * @return overview data for tutors
   */
  @Get('overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor)
  async myOverview(@GetUser() user: any) {
    return this.tutorsService.getMyOverview(user);
  }

  /**
   * Get authenticated tutor wallet
   *
   * @return tutor's wallet information
   */
  @Get('wallet')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor)
  async myWallet(@GetUser() user: any) {
    return this.tutorsService.getMyWallet(user);
  }

  /**
   * Request a payout from the wallet
   *
   * @param user - authenticated tutor user
   * @param body - payout request details
   * @returns payout request confirmation
   */
  @Post('payouts/request')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Tutor)
  async requestPayout(@GetUser() user: any, @Body() body: PaymentRequestDto) {
    return this.tutorsService.requestPayout(user, body);
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
  async tutorAvailability(
    @GetUser() user: any,
    @Param('tutorId') tutorId: MongoIdDto['id'],
  ) {
    return this.availabilityService.getTutorAvailability(user, tutorId);
  }
}
