import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { Booking } from '../models/booking.model';
import { Payment } from '../models/payment.model';
import { Payout } from '../models/payout.model';
import { TutorProfile } from '../models/tutorProfile.model';
import { User } from '../models/user.model';

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

  async getUsers() {
    return this.userModel.find();
  }

  async getBookings() {
    return this.bookingModel.find();
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

  async verifyTutor(tutorId: MongoIdDto['id']) {
    return this.tutorProfileModel.findByIdAndUpdate(
      tutorId,
      { verified: true },
      { new: true },
    );
  }
}
