import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { BaseService } from '../common/base.service';
import { getUserSub } from '../common/helpers';
import { User } from '../models/user.model';

@Injectable()
export class UsersService extends BaseService<User> {
  private readonly logger = new Logger(UsersService.name);
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

  /** Ensure a default admin user exists after DB connects. */
  async ensureAdminExists() {
    const admin = await this.model.findOne({ role: 'Admin' }).exec();
    if (admin) {
      this.logger.log(`Admin user exists: ${admin.email}`);
      return admin;
    }

    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
    const firstName = process.env.DEFAULT_ADMIN_FIRSTNAME || 'Admin';
    const lastName = process.env.DEFAULT_ADMIN_LASTNAME || 'User';
    const avatar = process.env.DEFAULT_ADMIN_AVATAR || 'default-avatar.png';

    const hashed = await bcrypt.hash(password, 10);
    const adminDoc = new this.model({
      email,
      password: hashed,
      firstName,
      lastName,
      role: 'Admin',
      avatar,
    });
    await adminDoc.save();
    this.logger.log(`Default admin created: ${email}`);
    return adminDoc;
  }
}
