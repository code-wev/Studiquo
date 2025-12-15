import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student)
  async submitReview(@Req() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.submitReview(req.user, dto);
  }
}
