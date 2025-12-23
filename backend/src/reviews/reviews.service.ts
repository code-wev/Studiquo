import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from '../models/Review.model';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
  ) {}

  async submitReview(user: any, dto: CreateReviewDto) {
    const review = await this.reviewModel.create({
      booking: dto.booking || null,
      student: user.userId,
      tutor: dto.tutor,
      rating: dto.rating,
      comment: dto.comment,
    });
    return review;
  }
}
