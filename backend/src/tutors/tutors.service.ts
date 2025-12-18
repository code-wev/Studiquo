import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { Model, Types } from 'mongoose';
import { Booking } from 'src/models/booking.model';
import { Payment } from 'src/models/payment.model';
import { Payout } from 'src/models/payout.model';
import { Review } from 'src/models/review.model';
import { TimeSlot } from 'src/models/timeSlot.model';
import { TutorAvailability } from 'src/models/tutorAvailability.model';
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

    @InjectModel(Booking.name)
    private bookingModel: Model<Booking>,

    @InjectModel(Payment.name)
    private paymentModel: Model<Payment>,

    @InjectModel(Payout.name)
    private payoutModel: Model<Payout>,

    @InjectModel(TimeSlot.name)
    private timeSlotModel: Model<TimeSlot>,

    @InjectModel(TutorAvailability.name)
    private tutorAvailabilityModel: Model<TutorAvailability>,
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
    if (query.search) {
      userFilter.firstName = { $regex: query.search, $options: 'i' };
    }

    if (query.search) {
      userFilter.lastName = { $regex: query.search, $options: 'i' };
    }

    if (query.search) {
      userFilter.bio = { $regex: query.search, $options: 'i' };
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
  async getPublicProfile(tutorId: MongoIdDto['id']) {
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
      .findOne({ user: userId })
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
