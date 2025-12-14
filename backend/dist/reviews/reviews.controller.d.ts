import { CreateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    submitReview(req: any, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../models/review.model").Review, {}, import("mongoose").DefaultSchemaOptions> & import("../models/review.model").Review & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
