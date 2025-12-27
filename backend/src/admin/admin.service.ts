import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'common/dto/pagination.dto';
import { SearchDto } from 'common/dto/search.dto';
import { searchPaginationQueryDto } from 'common/dto/searchPagination.dto';
import { Model, Types } from 'mongoose';
import { Refund } from 'src/models/Refund.model';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { Booking } from '../models/Booking.model';
import { Payment } from '../models/Payment.model';
import { Payout } from '../models/Payout.model';
import { TutorProfile } from '../models/TutorProfile.model';
import { User, UserRole } from '../models/User.model';
import { AdminOverViewQueryDto, ChangeRefundStatusDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Payout.name) private payoutModel: Model<Payout>,
    @InjectModel(Refund.name) private refundModel: Model<Refund>,
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfile>,
  ) {}

  /**
   * Get an overview of platform statistics including user counts and revenue.
   *
   * @param query - optional month and year for filtering revenue stats
   * @returns overview data including user counts and revenue breakdowns
   */
  async getOverview(query: AdminOverViewQueryDto) {
    const now = new Date();

    const month = query.month ?? now.getMonth() + 1; // 1–12
    const year = query.year ?? now.getFullYear();

    // ---- Date boundaries ----
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    // ---- Parallel counts ----
    const [totalTutors, totalStudents, pendingApproval] = await Promise.all([
      this.userModel.countDocuments({ role: UserRole.Tutor }),
      this.userModel.countDocuments({ role: UserRole.Student }),
      this.tutorProfileModel.countDocuments({ isApproved: false }),
    ]);

    // ---- Revenue aggregations (COMPLETED only) ----
    const [revenueAgg] = await this.paymentModel.aggregate([
      {
        $match: { status: 'COMPLETED' },
      },
      {
        $facet: {
          total: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
                totalCommission: { $sum: '$commission' },
                totalTutorEarning: { $sum: '$tutorEarning' },
              },
            },
          ],
          monthly: [
            {
              $match: {
                createdAt: { $gte: monthStart, $lte: monthEnd },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: '$amount' },
                commission: { $sum: '$commission' },
                tutorEarning: { $sum: '$tutorEarning' },
              },
            },
          ],
          yearly: [
            {
              $match: {
                createdAt: { $gte: yearStart, $lte: yearEnd },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: '$amount' },
                commission: { $sum: '$commission' },
                tutorEarning: { $sum: '$tutorEarning' },
              },
            },
          ],
        },
      },
    ]);

    const total = revenueAgg?.total?.[0] ?? {};
    const monthly = revenueAgg?.monthly?.[0] ?? {};
    const yearly = revenueAgg?.yearly?.[0] ?? {};

    return {
      users: {
        totalTutors,
        totalStudents,
        pendingTutorApproval: pendingApproval,
      },
      revenue: {
        total: {
          amount: total.totalRevenue ?? 0,
          commission: total.totalCommission ?? 0,
          tutorEarning: total.totalTutorEarning ?? 0,
        },
        monthly: {
          amount: monthly.revenue ?? 0,
          commission: monthly.commission ?? 0,
          tutorEarning: monthly.tutorEarning ?? 0,
        },
        yearly: {
          amount: yearly.revenue ?? 0,
          commission: yearly.commission ?? 0,
          tutorEarning: yearly.tutorEarning ?? 0,
        },
      },
      period: {
        month,
        monthName: new Date(year, month - 1).toLocaleString('default', {
          month: 'long',
        }),
        year,
      },
    };
  }

  /**
   * Get all registered payments.
   *
   * @returns list of payments with pagination
   */
  async getPayments(query: searchPaginationQueryDto) {
    const regex = new RegExp(query.search ?? '', 'i');

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const orConditions: any[] = [
      { transactionId: { $regex: regex } },
      { currency: { $regex: regex } },
      { status: { $regex: regex } },
    ];

    const searchNum = Number(query.search);
    if (!Number.isNaN(searchNum)) {
      orConditions.push({ amount: searchNum });
    }

    const payments = await this.paymentModel
      .find({ $or: orConditions })
      .select('-metadata -__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.paymentModel.countDocuments({ $or: orConditions });

    return {
      message: 'Payments retrieved successfully',
      payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all registered payouts.
   *
   * @returns list of payouts
   */
  // TODO: payout amount search not working properly and need to fix the
  async getPayouts(query: searchPaginationQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search?.trim();
    const regex = search ? new RegExp(search, 'i') : null;

    /** --------------------
     * Payout search filters
     * -------------------*/
    const payoutMatch: any = {};

    if (search) {
      const orConditions: any[] = [
        { transactionId: { $regex: regex } },
        { status: { $regex: regex } },
      ];

      const searchNum = Number(query.search);
      if (!Number.isNaN(searchNum)) {
        orConditions.push({ amount: searchNum });
      }

      payoutMatch.$or = orConditions;
    }

    /** --------------------
     * Tutor search filters
     * -------------------*/
    const tutorMatch = search
      ? {
          $or: [
            { 'tutor.firstName': { $regex: regex } },
            { 'tutor.lastName': { $regex: regex } },
            { 'tutor.email': { $regex: regex } },
          ],
        }
      : {};

    /** --------------------
     * Aggregation Pipeline
     * -------------------*/
    const pipeline: any[] = [
      ...(Object.keys(payoutMatch).length ? [{ $match: payoutMatch }] : []),

      {
        $lookup: {
          from: 'users',
          localField: 'tutorId',
          foreignField: '_id',
          as: 'tutor',
        },
      },
      { $unwind: '$tutor' },

      ...(search ? [{ $match: tutorMatch }] : []),

      { $sort: { createdAt: -1 } },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const result = await this.payoutModel.aggregate(pipeline);

    const data = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    return {
      message: 'Payouts retrieved successfully',
      results: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all registered tutors.
   *
   * @returns list of tutors with their profiles
   */
  async getStudents(search: SearchDto['search'], query: PaginationDto) {
    const regex = new RegExp(search ?? '', 'i');

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const results = await this.userModel.aggregate([
      // 1. Match students only
      {
        $match: {
          role: UserRole.Student,
        },
      },

      // 2. Pagination
      { $skip: skip },
      { $limit: limit },

      // 3. Search by studentId / name / email
      {
        $match: {
          $or: [
            { studentId: { $regex: regex } },
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { email: { $regex: regex } },
          ],
        },
      },

      // 4. Shape response
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          studentId: 1,
          email: 1,
          avatar: 1,
        },
      },
    ]);

    return {
      message: 'Search completed',
      results,
    };
  }

  /**
   * Get all the refund requests.
   *
   * @returns list of refund requests with pagination
   */
  async getRefunds(query: searchPaginationQueryDto) {
    const regex = new RegExp(query.search ?? '', 'i');

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const orConditions: any[] = [
      { status: { $regex: regex } },
      { currency: { $regex: regex } },
      { method: { $regex: regex } },
      { reason: { $regex: regex } },
    ];

    const searchNum = Number(query.search);
    if (!Number.isNaN(searchNum)) {
      orConditions.push({ amount: searchNum });
    }

    const refunds = await this.refundModel
      .find({ $or: orConditions })
      .select('-metadata -__v')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.refundModel.countDocuments({ $or: orConditions });

    return {
      message: 'Refunds retrieved successfully',
      refunds,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get refund request details with id
   *
   * @param refundId - ID of the refund request
   * @returns refund request details
   */
  async getRefundDetails(refundId: MongoIdDto['id']) {
    const refund = await this.refundModel
      .findById(refundId)
      .select('-metadata -__v')
      .populate('payment', '-metadata -__v')
      .populate('booking', '-metadata -__v')
      .populate('student', 'firstName lastName email studentId')
      .populate('tutor', 'firstName lastName email');

    if (!refund) {
    }

    return {
      message: 'Refund details retrieved successfully',
      refund,
    };
  }

  /**
   * Process a refund request by updating its status.
   *
   * @param refundId - ID of the refund request
   * @param status - New status for the refund request
   * @returns success message and updated refund request
   */
  async processRefund(
    refundId: MongoIdDto['id'],
    status: ChangeRefundStatusDto['status'],
  ) {
    const refund = await this.refundModel.findByIdAndUpdate(refundId, {
      status,
    });

    if (!refund) {
      throw new Error('Refund request not found');
    }

    if (!refund.booking) {
      throw new Error('Associated booking not found for this refund');
    }

    if (!refund.payment) {
      throw new Error('Associated payment not found for this refund');
    }

    if (status === 'APPROVED') {
      // Update payment status to REFUNDED
      await this.paymentModel.findByIdAndUpdate(refund.payment, {
        status: 'REFUNDED',
      });
    }

    if (status === 'REJECTED') {
      // Update payment status back to REFUND REJECTED
      await this.paymentModel.findByIdAndUpdate(refund.payment, {
        status: 'REFUND REJECTED',
      });
    }

    return {
      message: 'Refund status updated successfully',
      refund,
    };
  }

  // TODO: payout amount search not working properly and need to fix the
  async updatePayoutStatus(payoutId: MongoIdDto['id'], status: string) {
    return this.payoutModel.findByIdAndUpdate(
      payoutId,
      { status },
      { new: true },
    );
  }

  /**
   * Verify a tutor's profile by setting isApproved to true.
   *
   * @param tutorId - ID of the tutor profile to verify
   * @returns success message and updated tutor profile
   */
  async verifyTutor(tutorId: MongoIdDto['id']) {
    const updatedTutor = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(tutorId),
      { isApproved: true },
      { new: true },
    );

    if (!updatedTutor) {
      throw new Error('Tutor profile not found');
    }

    return {
      message: 'Tutor verified successfully',
      tutor: updatedTutor,
    };
  }

  /**
   * Reject a tutor's profile by setting isApproved to false.
   *
   * @param tutorId - ID of the tutor profile to reject
   * @returns success message and updated tutor profile
   */
  async rejectTutor(tutorId: MongoIdDto['id']) {
    const updatedTutor = await this.userModel.findByIdAndUpdate(
      new Types.ObjectId(tutorId),
      { isApproved: false },
      { new: true },
    );

    if (!updatedTutor) {
      throw new Error('Tutor profile not found');
    }

    return {
      message: 'Tutor rejected successfully',
      tutor: updatedTutor,
    };
  }
}
