import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../models/User.model';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Submit a review for a completed booking.
   *
   * @param user - The authenticated user submitting the review
   * @param dto - The review data transfer object
   * @returns The created review
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student)
  async submitReview(@GetUser() user: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.submitReview(user, dto);
  }
}
