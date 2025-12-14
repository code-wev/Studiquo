import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { Review } from 'src/models/review.model';
import { ReviewQueryDto } from 'src/reviews/dto/review.dto';
import { TutorProfile } from '../models/tutorProfile.model';
import { User } from '../models/user.model';
import { TutorSearchQueryDto } from './dto/tutor.dto';
export declare class TutorsService {
    private tutorProfileModel;
    private userModel;
    private reviewModel;
    constructor(tutorProfileModel: Model<TutorProfile>, userModel: Model<User>, reviewModel: Model<Review>);
    searchTutors(query: TutorSearchQueryDto): Promise<(import("mongoose").Document<unknown, {}, TutorProfile, {}, import("mongoose").DefaultSchemaOptions> & TutorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getPublicProfile(tutorId: MongoIdDto['id']): Promise<{
        id: import("mongoose").Types.ObjectId;
        subjects: string[];
        hourlyRate: number;
        user: import("mongoose").Types.ObjectId;
    }>;
    getTutorReviews(tutorId: MongoIdDto['id'], query: ReviewQueryDto): Promise<{
        data: (Review & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
