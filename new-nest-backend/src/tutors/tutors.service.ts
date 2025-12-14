import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TutorProfile } from '../models/tutorProfile.model';
import { User } from '../models/user.model';

@Injectable()
export class TutorsService {
  constructor(
    @InjectModel(TutorProfile.name)
    private tutorProfileModel: Model<TutorProfile>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

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
