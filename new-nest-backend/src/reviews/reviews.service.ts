import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getUserSub } from '../common/helpers';
import { Review } from '../models/review.model';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<Review>) {}

  async submitReview(req: { user: any }, dto: CreateReviewDto) {
    const review = new this.reviewModel({ ...dto, student: getUserSub(req) });
    await review.save();
    return review;
  }
}
