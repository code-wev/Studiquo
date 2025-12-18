import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { Model, Types } from 'mongoose';
import { Booking } from 'src/models/booking.model';
import { Payment } from 'src/models/payment.model';
import { Payout } from 'src/models/payout.model';
import { Review } from 'src/models/review.model';
import { ReviewQueryDto } from 'src/reviews/dto/review.dto';
import { TutorProfile } from '../models/tutorProfile.model';
import { TutorSearchPaginationDto } from './dto/tutor.dto';

@Injectable()
export class TutorsService {
  /**
   * Tutors service provides search and public-data access for tutors.
   */
  constructor(
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfile>,

    @InjectModel(Review.name)
    private reviewModel: Model<Review>,

    @InjectModel(Booking.name)
    private bookingModel: Model<Booking>,

    @InjectModel(Payment.name)
    private paymentModel: Model<Payment>,

    @InjectModel(Payout.name)
    private payoutModel: Model<Payout>,
  ) {}
  /**
   * Search tutors by profile and user fields.
   *
   * Supports filtering by subject, hourly rate and user fields like
   * `firstName`, `lastName`, and `bio`.
   *
   * @param query - validated search query DTO
   * @param pagination - pagination options
   * @returns paginated list of tutor profiles
   */
  async searchTutors(query: TutorSearchPaginationDto) {
    const {
      subject,
      maxHourlyRate,
      minRating,
      search,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    /** --------------------
     * Tutor base filter
     * -------------------*/
    const tutorMatch: any = {};

    if (subject) {
      tutorMatch.subjects = subject;
    }

    if (maxHourlyRate !== undefined) {
      tutorMatch.hourlyRate = { $lte: maxHourlyRate };
    }

    /** --------------------
     * User search filter
     * -------------------*/
    let userMatchStage: any = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      userMatchStage = {
        $or: [
          { 'user.firstName': regex },
          { 'user.lastName': regex },
          { 'user.bio': regex },
        ],
      };
    }

    /** --------------------
     * Aggregation Pipeline
     * -------------------*/
    const pipeline: any[] = [
      { $match: tutorMatch },

      // Join user
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },

      // Apply search on user fields
      ...(search ? [{ $match: userMatchStage }] : []),

      // Join reviews
      {
        $lookup: {
          from: 'reviews',
          localField: 'user._id',
          foreignField: 'tutor',
          as: 'reviews',
        },
      },

      // Calculate average rating
      {
        $addFields: {
          averageRating: {
            $cond: [
              { $gt: [{ $size: '$reviews' }, 0] },
              { $avg: '$reviews.rating' },
              null,
            ],
          },
          ratingCount: { $size: '$reviews' },
        },
      },

      // Filter by minRating (after calculation)
      ...(minRating !== undefined
        ? [{ $match: { averageRating: { $gte: minRating } } }]
        : []),

      // Clean output
      {
        $project: {
          reviews: 0,
          'user.dbsLink': 0,
          'user.referralSource': 0,
          'user.password': 0,
          'user.email': 0,
        },
      },
    ];

    /** --------------------
     * Pagination + Count
     * -------------------*/
    const [data, totalResult] = await Promise.all([
      this.tutorProfileModel
        .aggregate([...pipeline, { $skip: skip }, { $limit: limit }])
        .exec(),

      this.tutorProfileModel
        .aggregate([...pipeline, { $count: 'total' }])
        .exec(),
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      message: 'Tutors fetched successfully',
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Return a public view of a tutor's profile including basic user info.
   *
   * Throws `NotFoundException` if the profile does not exist.
   *
   * @param tutorId - id of the tutor profile to fetch
   */
  async getPublicProfile(tutorId: MongoIdDto['id']) {
    const tutorProfile = await this.tutorProfileModel
      .findOne({ user: new Types.ObjectId(tutorId) })
      .populate({
        path: 'user',
        select: 'firstName lastName avatar bio role',
      })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    // Get average rating and count
    const ratingStats = await this.reviewModel.aggregate([
      { $match: { tutor: new Types.ObjectId(tutorId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    const averageRating = ratingStats[0]?.averageRating || 0;
    const ratingCount = ratingStats[0]?.ratingCount || 0;

    return {
      id: tutorProfile._id,
      subjects: tutorProfile.subjects,
      hourlyRate: tutorProfile.hourlyRate,
      user: tutorProfile.user,
      averageRating,
      ratingCount,
    };
  }

  /**
   * Return paginated reviews for a tutor, including student info.
   *
   * @param tutorId - tutor document id
   * @param query - pagination and filter options for reviews
   */
  async getTutorReviews(tutorId: MongoIdDto['id'], query: ReviewQueryDto) {
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

  /**
   * Return an overview for the authenticated (logged-in) tutor.
   * Expects `req.user` to contain a `sub` field with the user's id (JWT payload).
   */
  async getMyOverview(user: any) {
    const userId = user.userId;

    const tutorProfile = await this.tutorProfileModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    // Aggregate key metrics in parallel
    const [
      distinctStudents,
      totalSessions,
      earningsAgg,
      pendingPayoutAgg,
      ratingAgg,
      upcomingRaw,
    ] = await Promise.all([
      this.paymentModel.distinct('student', {
        tutor: userId,
        status: 'COMPLETED',
      }),
      this.paymentModel.countDocuments({ tutor: userId, status: 'COMPLETED' }),
      this.paymentModel
        .aggregate([
          {
            $match: { tutor: new Types.ObjectId(userId), status: 'COMPLETED' },
          },
          { $group: { _id: null, total: { $sum: '$tutorEarning' } } },
        ])
        .exec(),
      this.payoutModel
        .aggregate([
          {
            $match: {
              tutorId: new Types.ObjectId(userId),
              status: { $ne: 'COMPLETED' },
            },
          },
          { $group: { _id: null, totalPending: { $sum: '$amount' } } },
        ])
        .exec(),
      this.reviewModel
        .aggregate([
          { $match: { tutor: new Types.ObjectId(userId) } },
          {
            $group: {
              _id: null,
              avgRating: { $avg: '$rating' },
              count: { $sum: 1 },
            },
          },
        ])
        .exec(),
      // Upcoming bookings for this tutor (joined via timeSlot -> tutorAvailability)
      this.bookingModel
        .find({ status: 'SCHEDULED', date: { $gte: new Date() } })
        .populate({
          path: 'timeSlot',
          populate: {
            path: 'tutorAvailability',
            match: { user: userId },
            select: 'user date',
          },
        })
        .sort({ date: 1 })
        .limit(5)
        .lean(),
    ]);

    const upcoming = (upcomingRaw || []).filter(
      (b: any) => b.timeSlot && b.timeSlot.tutorAvailability,
    );

    return {
      tutorProfileId: tutorProfile._id,
      subjects: tutorProfile.subjects,
      hourlyRate: tutorProfile.hourlyRate,
      totalStudents: (distinctStudents || []).length,
      totalSessions: totalSessions || 0,
      totalEarnings:
        (earningsAgg && earningsAgg[0] && earningsAgg[0].total) || 0,
      pendingPayouts:
        (pendingPayoutAgg &&
          pendingPayoutAgg[0] &&
          pendingPayoutAgg[0].totalPending) ||
        0,
      averageRating:
        (ratingAgg && ratingAgg[0] && ratingAgg[0].avgRating) || null,
      ratingCount: (ratingAgg && ratingAgg[0] && ratingAgg[0].count) || 0,
      upcomingSessions: upcoming.map((b: any) => ({
        id: b._id,
        date: b.date,
        subject: b.subject,
        type: b.type,
        timeSlot: b.timeSlot
          ? {
              id: b.timeSlot._id,
              startTime: b.timeSlot.startTime,
              endTime: b.timeSlot.endTime,
            }
          : null,
      })),
    };
  }
}
