import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from 'src/models/review.model';
import { ReviewQueryDto } from 'src/reviews/dto/review.dto';
import { TutorProfile } from '../models/tutorProfile.model';
import { User } from '../models/user.model';
import { TutorSearchQueryDto } from './dto/tutor.dto';

@Injectable()
export class TutorsService {
  /**
   * Tutors service provides search and public-data access for tutors.
   */
  constructor(
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfile>,

    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Review.name)
    private reviewModel: Model<Review>,
  ) {}
  /**
   * Search tutors by profile and user fields.
   *
   * Supports filtering by subject, hourly rate and user fields like
   * `firstName`, `lastName`, and `bio`.
   *
   * @param query - validated search query DTO
   */
  async searchTutors(query: TutorSearchQueryDto) {
    const tutorFilter: any = {};
    const userFilter: any = {};

    // TutorProfile filters
    if (query.subject) {
      tutorFilter.subjects = query.subject;
    }

    if (query.maxHourlyRate !== undefined) {
      tutorFilter.hourlyRate = { $lte: query.maxHourlyRate };
    }

    if (query.minRating !== undefined) {
      tutorFilter.rating = { $gte: query.minRating };
    }

    // User filters
    if (query.firstName) {
      userFilter.firstName = { $regex: query.firstName, $options: 'i' };
    }

    if (query.lastName) {
      userFilter.lastName = { $regex: query.lastName, $options: 'i' };
    }

    if (query.bio) {
      userFilter.bio = { $regex: query.bio, $options: 'i' };
    }

    return this.tutorProfileModel
      .find(tutorFilter)
      .populate({
        path: 'user',
        match: userFilter,
        select: 'firstName lastName avatar bio',
      })
      .exec();
  }
  /**
   * Return a public view of a tutor's profile including basic user info.
   *
   * Throws `NotFoundException` if the profile does not exist.
   *
   * @param tutorId - id of the tutor profile to fetch
   */
  async getPublicProfile(tutorId: string) {
    const tutorProfile = await this.tutorProfileModel
      .findById(tutorId)
      .populate({
        path: 'user',
        select: 'firstName lastName avatar bio role',
      })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    return {
      id: tutorProfile._id,
      subjects: tutorProfile.subjects,
      hourlyRate: tutorProfile.hourlyRate,
      user: tutorProfile.user,
    };
  }
  /**
   * Return paginated reviews for a tutor, including student info.
   *
   * @param tutorId - tutor document id
   * @param query - pagination and filter options for reviews
   */
  async getTutorReviews(tutorId: string, query: ReviewQueryDto) {
    const { page = 1, limit = 10, rating } = query;

    const filter: any = { tutor: tutorId };

    if (rating) {
      filter.rating = rating;
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .populate('student', 'firstName lastName avatar')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.reviewModel.countDocuments(filter),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
