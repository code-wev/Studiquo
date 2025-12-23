import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { Model } from 'mongoose';
import { Booking } from '../models/Booking.model';
import { Payment } from '../models/Payment.model';
import { Payout } from '../models/Payout.model';
import { TutorProfile } from '../models/TutorProfile.model';
import { User } from '../models/User.model';

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
