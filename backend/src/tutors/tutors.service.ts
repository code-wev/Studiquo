import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'common/dto/pagination.dto';
import { Model, Types } from 'mongoose';
import { User, UserRole } from 'src/models/User.model';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { Booking } from '../models/Booking.model';
import { Payment } from '../models/Payment.model';
import { Payout } from '../models/Payout.model';
import { Review } from '../models/Review.model';
import { TutorProfile } from '../models/TutorProfile.model';
import { Wallet } from '../models/Wallet.model';
import { ReviewQueryDto } from '../reviews/dto/review.dto';
import { PaymentRequestDto, TutorSearchPaginationDto } from './dto/tutor.dto';

@Injectable()
export class TutorsService {
  /**
   * Tutors service provides search and public-data access for tutors.
   */
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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
    @InjectModel(Wallet.name)
    private walletModel: Model<Wallet>,
  ) {}
  /**
   * Search tutors by profile and user fields.
   *
   * Supports filtering by subject, hourly rate and user fields like
   * `firstName`, `lastName`, and `bio`.
   *
   * @param user - authenticated user (optional)
   * @param query - validated search query DTO
   * @param pagination - pagination options
   * @returns paginated list of tutor profiles
   */
  async searchTutors(user: any, query: TutorSearchPaginationDto) {
    const {
      subject,
      maxHourlyRate,
      minHourlyRate,
      minRating,
      search,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;
    const role = user?.role ?? null;
    const isAdmin = role === UserRole.Admin;

    const matchConditions: any = {};

    // Filtering by subjects
    if (subject) {
      matchConditions.subjects = { $in: subject }; // Match tutors' subjects
    }

    // Filtering by hourly rates
    const rateConditions: any[] = [];

    if (maxHourlyRate !== undefined) {
      rateConditions.push({
        $or: [
          { groupHourlyRate: { $lte: maxHourlyRate } },
          { oneOnOneHourlyRate: { $lte: maxHourlyRate } },
        ],
      });
    }

    if (minHourlyRate !== undefined) {
      rateConditions.push({
        $or: [
          { groupHourlyRate: { $gte: minHourlyRate } },
          { oneOnOneHourlyRate: { $gte: minHourlyRate } },
        ],
      });
    }

    if (rateConditions.length) {
      matchConditions.$and = rateConditions;
    }

    // User search filter (name, email, or bio)
    const userSearchMatch = search
      ? [
          {
            $match: {
              $or: [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { bio: new RegExp(search, 'i') },
              ],
            },
          },
        ]
      : [];

    const pipeline: any[] = [
          // Match users based on filtering conditions
          { $match: { ...matchConditions, role: UserRole.Tutor } },
    
          // Match the role: Admin can see all, non-admins only approved tutors
          ...(!isAdmin ? [{ $match: { isApproved: true } }] : []),

      // Include user details
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          role: 1,
          avatar: 1,
          avatarKey: 1,
          googleId: 1,
          isApproved: 1,
          bio: 1,
          subjects: 1,
          groupHourlyRate: 1,
          oneOnOneHourlyRate: 1,
          averageRating: 1, // assuming this field exists or is calculated
          ratingCount: 1, // assuming this field exists or is calculated
        },
      },

      // Apply search filter if applicable
      ...userSearchMatch,

      // Lookup reviews to calculate ratings
      {
        $lookup: {
          from: 'reviews', // Assuming reviews are stored in a 'reviews' collection
          let: { tutorId: '$_id' }, // Use the tutor's user ID for the join
          pipeline: [
            { $match: { $expr: { $eq: ['$tutor', '$$tutorId'] } } }, // Match tutor reviews
            {
              $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                ratingCount: { $sum: 1 },
              },
            },
          ],
          as: 'ratingStats', // Collect rating stats in 'ratingStats'
        },
      },

      // Add calculated ratings to the result
      {
        $addFields: {
          averageRating: { $arrayElemAt: ['$ratingStats.averageRating', 0] },
          ratingCount: { $arrayElemAt: ['$ratingStats.ratingCount', 0] },
        },
      },
      { $project: { ratingStats: 0 } },

      // Filter by minimum rating if required
      ...(minRating !== undefined
        ? [{ $match: { averageRating: { $gte: minRating } } }]
        : []),

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    // Perform the aggregation with pagination
    const [data, totalResult] = await Promise.all([
      this.userModel.aggregate(pipeline),
      this.userModel.aggregate([
        { $match: matchConditions },
        { $count: 'total' },
      ]),
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
      .findOne({ user: new Types.ObjectId(tutorId), isApproved: true })
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
      groupHourlyRate: tutorProfile.groupHourlyRate,
      oneOnOneHourlyRate: tutorProfile.oneOnOneHourlyRate,
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
    // Only approve profile reviews
    const tutorProfile = await this.tutorProfileModel
      .findOne({ user: new Types.ObjectId(tutorId), isApproved: true })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found or not approved');
    }

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
      .findOne({ user: new Types.ObjectId(userId), isApproved: true })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found or not approved');
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
      groupHourlyRate: tutorProfile.groupHourlyRate,
      oneOnOneHourlyRate: tutorProfile.oneOnOneHourlyRate,
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

  /**
   * Return wallet for authenticated tutor.
   *
   * @param user - authenticated tutor user
   * @returns tutor wallet details
   */
  async getMyWallet(user: any) {
    const userId = user.userId;

    const tutorProfile = await this.tutorProfileModel
      .findOne({ user: new Types.ObjectId(userId), isApproved: true })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found or not approved');
    }

    const wallet = await this.walletModel
      .findOne({ tutorId: new Types.ObjectId(userId) })
      .select('-__v -transactions')
      .lean();

    return {
      message: 'Wallet fetched successfully',
      wallet,
    };
  }

  /**
   * Get payment history for the authenticated tutor
   *
   * @param user - authenticated tutor user
   * @param dto - pagination details
   * @return list of payments made to the tutor
   */
  async getPaymentHistory(user: any, dto: PaginationDto) {
    const userId = user.userId;

    const tutorProfile = await this.tutorProfileModel
      .findOne({ user: new Types.ObjectId(userId), isApproved: true })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found or not approved');
    }

    const { page = 1, limit = 10 } = dto;

    const skip = (page - 1) * limit;

    const payments = await this.paymentModel
      .find({ tutor: new Types.ObjectId(userId), status: 'COMPLETED' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(userId);

    const payouts = await this.payoutModel.find({
      tutorId: new Types.ObjectId(userId),
    });
    // .sort({ createdAt: -1 })
    // .skip(skip)
    // .limit(limit)
    // .lean();

    console.log(payouts);

    return {
      message: 'Payment history fetched successfully',
      payments,
      payouts,
      meta: {
        page,
        limit,
      },
    };
  }

  /**
   * Tutor requests a payout. Amount expected in smallest currency unit (cents).
   */
  async requestPayout(user: any, dto: PaymentRequestDto) {
    const userId = user.userId;

    const tutorProfile = await this.tutorProfileModel
      .findOne({ user: new Types.ObjectId(userId), isApproved: true })
      .lean();

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found or not approved');
    }

    const { amount } = dto;

    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid payout amount');
    }

    // Load wallet
    const wallet = await this.walletModel.findOne({
      tutorId: new Types.ObjectId(userId),
    });

    const balance = (wallet && wallet.balance) || 0;

    if (balance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    // Deduct amount from wallet and create payout request
    const session = await this.walletModel.db.startSession();
    session.startTransaction();
    try {
      await this.walletModel
        .updateOne(
          { tutorId: new Types.ObjectId(userId) },
          { $inc: { balance: -amount }, $set: { updatedAt: new Date() } },
        )
        .session(session);

      const payout = await this.payoutModel.create(
        [
          {
            tutorId: new Types.ObjectId(userId),
            amount,
            status: 'PENDING',
            transactionId: '',
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return {
        message: 'Payout requested successfully',
        payout: payout[0],
      };
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}
