import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { getUserSub } from '../common/helpers';
import { User } from '../models/user.model';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }

  async getMe(req: { user: any }) {
    return this.model.findById(getUserSub(req)).select('-password');
  }

  async updateMe(req: { user: any }, data: any) {
    return this.model
      .findByIdAndUpdate(getUserSub(req), data, { new: true })
      .select('-password');
  }

  async uploadAvatar(req: { user: any }, avatar: string) {
    return this.model
      .findByIdAndUpdate(getUserSub(req), { avatar }, { new: true })
      .select('-password');
  }

  async updatePassword(req: { user: any }, data: any) {
    const userDoc = await this.model.findById(getUserSub(req));
    if (!userDoc) throw new UnauthorizedException('User not found');
    userDoc.password = await bcrypt.hash(data.newPassword, 10);
    await userDoc.save();
    return { message: 'Password updated' };
  }
}
