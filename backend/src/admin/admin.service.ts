import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoIdDto } from '../../common/dto/mongoId.dto';
import { Booking } from '../models/Booking.model';
import { Payment } from '../models/Payment.model';
import { Payout } from '../models/Payout.model';
import { TutorProfile } from '../models/TutorProfile.model';
import { User, UserRole } from '../models/User.model';
import { AdminOverViewQueryDto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Payout.name) private payoutModel: Model<Payout>,
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

  async getPayments() {
    return this.paymentModel.find();
  }

  async getPayouts() {
    return this.payoutModel.find();
  }

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
    const updatedTutor = await this.tutorProfileModel.findByIdAndUpdate(
      tutorId,
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
    const updatedTutor = await this.tutorProfileModel.findByIdAndUpdate(
      tutorId,
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
