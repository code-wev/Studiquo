import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getUserSub } from '../../common/helpers';
import { Review } from '../models/review.model';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async submitReview(req: { user: any }, dto: CreateReviewDto) {
    const studentId = getUserSub(req);

    const review = await this.reviewModel.create({
      booking: dto.booking || null,
      student: studentId,
      tutor: dto.tutor,
      rating: dto.rating,
      comment: dto.comment,
    });
    return review;
  }
}
