import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getUserSub } from '../common/helpers';
import { TutorProfile } from '../models/tutorProfile.model';
import { User } from '../models/user.model';
import {
  CreateTutorProfileDto,
  UpdateTutorProfileDto,
} from './dto/tutor-profile.dto';

@Injectable()
export class TutorsService {
  constructor(
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfile>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createProfile(req: { user: any }, dto: CreateTutorProfileDto) {
    const profile = new this.tutorProfileModel({
      ...dto,
      user: getUserSub(req),
    });
    await profile.save();
    return profile;
  }

  async getMyProfile(req: { user: any }) {
    return this.tutorProfileModel.findOne({ user: getUserSub(req) });
  }

  async updateMyProfile(req: { user: any }, dto: UpdateTutorProfileDto) {
    return this.tutorProfileModel.findOneAndUpdate(
      { user: getUserSub(req) },
      dto,
      {
        new: true,
      },
    );
  }

  async searchTutors(query: any) {
    // Simple search by subject or rating
    const filter: any = {};
    if (query.subject) filter.subjects = query.subject;
    if (query.minRating) filter.rating = { $gte: Number(query.minRating) };
    return this.tutorProfileModel.find(filter);
  }

  async getPublicProfile(tutorId: string) {
    return this.tutorProfileModel.findById(tutorId);
  }

  async getTutorReviews(tutorId: string) {
    // Stub: implement review lookup
    return [];
  }
}
