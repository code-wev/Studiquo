import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { Model, Types } from 'mongoose';
import { StudentProfile } from 'src/models/studentProfile.model';
import { TutorProfile } from 'src/models/tutorProfile.model';
import { BaseService } from '../../common/base.service';
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

    private jwtService: JwtService,
  ) {
    super(userModel);
  }
  /**
   * Return the authenticated user's profile without the password field.
   *
   * @param req - the request object that contains `user` (set by auth guard)
   */
  async getMe(userId: MongoIdDto['id']) {
    const user = await this.model.findById(userId).select('-password').lean();

    if (!user) throw new UnauthorizedException('User not found');

    let profile: any = null;

    if (user.role === UserRole.Tutor) {
      profile = await this.tutorProfileModel
        .findOne({ user: new Types.ObjectId(userId) })
        .lean();
    }

    if (user.role === UserRole.Student) {
      profile = await this.studentProfileModel
        .findOne({ user: new Types.ObjectId(userId) })
        .lean();
    }

    return { message: 'User profile retrieved successfully', user, profile };
  }

  /**
   * Update the authenticated user's document with provided data.
   *
   * @param req - the request object that contains `user` (set by auth guard)
   * @param data - partial user fields to update
   */
  async updateMe(user: any, data: UpdateProfileDto) {
    // Check user exists
    const userDoc = await this.model.findById(user.userId);
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
      subjects,
      groupHourlyRate,
      oneOnOneHourlyRate,
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
      await this.model.findByIdAndUpdate(user.userId, { $set: userUpdate });
    }

    /**
     * Role-specific profile updates
     */
    let profile = null;

    if (userRole === UserRole.Tutor) {
      const tutorUpdate: any = {};
      if (subjects !== undefined) tutorUpdate.subjects = subjects;
      if (groupHourlyRate !== undefined)
        tutorUpdate.groupHourlyRate = groupHourlyRate;
      if (oneOnOneHourlyRate !== undefined)
        tutorUpdate.oneOnOneHourlyRate = oneOnOneHourlyRate;

      profile = await this.tutorProfileModel.findOneAndUpdate(
        { user: new Types.ObjectId(user.userId) },
        { $set: tutorUpdate },
        { new: true, upsert: true },
      );
    }

    if (userRole === UserRole.Student) {
      const studentUpdate: any = {};
      profile = await this.studentProfileModel.findOneAndUpdate(
        { user: new Types.ObjectId(user.userId) },
        { $set: studentUpdate },
        { new: true, upsert: true },
      );
    }

    /**
     * Fetch updated user
     */
    const updatedUser = await this.model
      .findById(user.userId)
      .select('-password')
      .lean();

    /**
     * Generate the new access token
     */

    const token = this.jwtService.sign({
      sub: user._id,
      studentId: user.studentId || null,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
    /**
     * Return merged response
     */
    return {
      message: 'Profile updated successfully',
      user: updatedUser,
      profile,
      token,
    };
  }

  /**
   * Add a child (student) to a parent user's `children` array.
   *
   * @param parentId - the MongoDB ID of the parent user
   * @param studentId - the studentId of the child to add
   */
  async addChildToParent(
    parentId: MongoIdDto['id'],
    studentId: MongoIdDto['id'],
  ) {
    // Find parent
    const parent = await this.model.findById(parentId);
    if (!parent) {
      throw new NotFoundException('Parent not found');
    }

    if (parent.role !== UserRole.Parent) {
      throw new ForbiddenException('Only parents can add children');
    }

    // Find student by studentId
    const student = await this.model.findOne({
      studentId,
      role: UserRole.Student,
    });

    if (!student) {
      throw new NotFoundException('Student not found with this ID');
    }

    // Prevent adding self
    if (student._id.equals(parent._id)) {
      throw new BadRequestException('You cannot add yourself as a child');
    }

    // Add child (no duplicates)
    await this.model.updateOne(
      { _id: parent._id },
      { $addToSet: { children: new Types.ObjectId(student._id) } },
    );

    return {
      message: 'Child added successfully',
      student: {
        id: student._id,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
      },
    };
  }

  /**
   * Change the authenticated user's password.
   *
   * @param req - the request object that contains `user` (set by auth guard)
   * @param data - object containing `newPassword` property
   * @returns an object with a message on success
   */
  async updatePassword(user: any, data: any) {
    const userDoc = await this.model.findById(user.userId);
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
