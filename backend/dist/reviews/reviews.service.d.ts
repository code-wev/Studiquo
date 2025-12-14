import { Model } from 'mongoose';
import { Review } from '../models/review.model';
import { CreateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private readonly reviewModel;
    constructor(reviewModel: Model<Review>);
    submitReview(req: {
        user: any;
    }, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, Review, {}, import("mongoose").DefaultSchemaOptions> & Review & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
