import { AvailabilityService } from 'src/availability/availability.service';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { ReviewQueryDto } from 'src/reviews/dto/review.dto';
import { TutorSearchQueryDto } from './dto/tutor.dto';
import { TutorsService } from './tutors.service';
export declare class TutorsController {
    private readonly tutorsService;
    private readonly availabilityService;
    constructor(tutorsService: TutorsService, availabilityService: AvailabilityService);
    searchTutors(query: TutorSearchQueryDto): Promise<(import("mongoose").Document<unknown, {}, import("../models/tutorProfile.model").TutorProfile, {}, import("mongoose").DefaultSchemaOptions> & import("../models/tutorProfile.model").TutorProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    publicProfile(tutorId: MongoIdDto['id']): Promise<{
        id: import("mongoose").Types.ObjectId;
        subjects: string[];
        hourlyRate: number;
        user: import("mongoose").Types.ObjectId;
    }>;
    tutorReviews(params: MongoIdDto, query: ReviewQueryDto): Promise<{
        data: (import("../models/review.model").Review & Required<{
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
    tutorAvailability(tutorId: MongoIdDto['id']): Promise<{
        date: string;
        slots: import("../models/timeSlot.model").TimeSlot[];
    }[]>;
}
