import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { StudentProfile } from 'src/models/studentProfile.model';
import { TutorProfile } from 'src/models/tutorProfile.model';
import { BaseService } from '../../common/base.service';
import { getUserSub } from '../../common/helpers';
import { User, UserRole } from '../models/user.model';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UsersService extends BaseService<User> {
  private readonly logger = new Logger(UsersService.name);

  /**
   * Create the `UsersService`.
   *
   * @param userModel - injected Mongoose model for `User`.
   */
  constructor(
    @InjectModel(User.name)
    userModel: Model<User>,

    @InjectModel(TutorProfile.name)
    private readonly tutorProfileModel: Model<TutorProfile>,

    @InjectModel(StudentProfile.name)
    private readonly studentProfileModel: Model<StudentProfile>,
  ) {
    super(userModel);
  }
  /**
   * Return the authenticated user's profile without the password field.
   *
   * @param req - the request object that contains `user` (set by auth guard)
   */
  async getMe(userId: string) {
    const user = await this.model.findById(userId).select('-password').lean();

    console.log(user);
    if (!user) throw new UnauthorizedException('User not found');

    let profile: any = null;

    if (user.role === UserRole.Tutor) {
      profile = await this.tutorProfileModel.findOne({ user: userId }).lean();
    }

    if (user.role === UserRole.Student) {
      profile = await this.studentProfileModel.findOne({ user: userId }).lean();
    }

    return { message: 'User profile retrieved successfully', ...user, profile };
  }

  /**
   * Update the authenticated user's document with provided data.
   *
   * @param req - the request object that contains `user` (set by auth guard)
   * @param data - partial user fields to update
   */
  async updateMe(req, data: UpdateProfileDto) {
    const userId = getUserSub(req);

    // Check user exists
    const userDoc = await this.model.findById(userId);
    if (!userDoc) throw new UnauthorizedException('User not found');

    const userRole = userDoc.role;

    /**
     * Split payload
     */
    const {
      // user fields
      firstName,
      lastName,
      bio,
      avatar,
      dbsLink,

      // tutor fields
      subject,
      hourlyRate,

      // student fields
      yearGroup,
      confidenceLevel,
      currentGrade,
      targetGrade,
    } = data;

    /**
     * Update USER collection
     */
    const userUpdate: any = {};
    if (firstName !== undefined) userUpdate.firstName = firstName;
    if (lastName !== undefined) userUpdate.lastName = lastName;
    if (bio !== undefined) userUpdate.bio = bio;
    if (avatar !== undefined) userUpdate.avatar = avatar;
    if (dbsLink !== undefined) userUpdate.dbsLink = dbsLink;

    if (Object.keys(userUpdate).length > 0) {
      await this.model.findByIdAndUpdate(userId, { $set: userUpdate });
    }

    /**
     * Role-specific profile updates
     */
    let profile = null;

    if (userRole === UserRole.Tutor) {
      const tutorUpdate: any = {};
      if (subject !== undefined) tutorUpdate.subjects = [subject];
      if (hourlyRate !== undefined) tutorUpdate.hourlyRate = hourlyRate;

      profile = await this.tutorProfileModel.findOneAndUpdate(
        { user: userId },
        { $set: tutorUpdate },
        { new: true, upsert: true },
      );
    }

    if (userRole === UserRole.Student) {
      const studentUpdate: any = {};
      if (yearGroup !== undefined) studentUpdate.yearGroup = yearGroup;
      if (confidenceLevel !== undefined)
        studentUpdate.confidenceLevel = confidenceLevel;
      if (currentGrade !== undefined) studentUpdate.currentGrade = currentGrade;
      if (targetGrade !== undefined) studentUpdate.targetGrade = targetGrade;

      profile = await this.studentProfileModel.findOneAndUpdate(
        { user: userId },
        { $set: studentUpdate },
        { new: true, upsert: true },
      );
    }

    /**
     * Fetch updated user
     */
    const updatedUser = await this.model
      .findById(userId)
      .select('-password')
      .lean();

    /**
     * Return merged response
     */
    return {
      ...updatedUser,
      profile,
    };
  }

  /**
   * Change the authenticated user's password.
   *
   * @param req - the request object that contains `user` (set by auth guard)
   * @param data - object containing `newPassword` property
   * @returns an object with a message on success
   */
  async updatePassword(req: { user: any }, data: any) {
    const userDoc = await this.model.findById(getUserSub(req));
    if (!userDoc) throw new UnauthorizedException('User not found');
    userDoc.password = await bcrypt.hash(data.newPassword, 10);
    await userDoc.save();
    return { message: 'Password updated' };
  }

  /**
   * Ensure a default admin user exists after DB connects.
   * If none is found, create one using environment defaults.
   */
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
