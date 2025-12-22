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
import { SearchDto } from 'common/dto/search.dto';
import { Model, Types } from 'mongoose';
import { AwsService } from 'src/aws/aws.service';
import { StudentProfile } from 'src/models/StudentProfile.model';
import { TutorProfile } from 'src/models/TutorProfile.model';
import { BaseService } from '../../common/base.service';
import { User, UserRole } from '../models/User.model';
import {
  RespondToParentRequestDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from './dto/user.dto';

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
    private awsService: AwsService,
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
  async updateMe(
    user: any,
    data: UpdateProfileDto,
    avatar?: Express.Multer.File,
  ) {
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
      dbsLink,

      // tutor fields
      subjects,
      groupHourlyRate,
      oneOnOneHourlyRate,
    } = data as any;

    /**
     * Update USER collection
     */
    const userUpdate: any = {};
    if (firstName !== undefined) userUpdate.firstName = firstName;
    if (lastName !== undefined) userUpdate.lastName = lastName;
    if (bio !== undefined) userUpdate.bio = bio;

    // Avatar handling: accept uploaded file `avatar` (multer) or data URL in `data.avatar`
    const avatarPayload = avatar || (data as any).avatar;
    if (avatarPayload !== undefined) {
      // Delete previous avatar from S3 if present (use avatarKey field on User)
      try {
        if (userDoc.avatarKey) {
          await this.awsService.deleteObject(userDoc.avatarKey);
        }
      } catch (err) {
        this.logger.warn(
          'Failed to delete previous avatar from S3',
          err as any,
        );
      }
      // Upload new avatar using util
      try {
        // TODO: complete the avatar upload process
      } catch (err) {
        this.logger.warn('Avatar upload failed', err as any);
      }
    }

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
    if (!parent) throw new NotFoundException('Parent not found');

    // Find student by studentId
    const student = await this.model.findOne({
      _id: new Types.ObjectId(studentId),
      role: UserRole.Student,
    });

    if (!student) throw new NotFoundException('Student not found with this ID');

    // Prevent adding self
    if (student._id.equals(parent._id)) {
      throw new BadRequestException('You cannot add yourself as a child');
    }

    // If parent already approved (exists in parent's children) -> short-circuit
    const alreadyChild = await this.model.findOne({
      _id: new Types.ObjectId(parent._id),
      children: new Types.ObjectId(student._id),
    });

    if (alreadyChild) {
      return {
        message: 'This child is already linked to you',
        student: {
          id: student._id,
          studentId: student.studentId,
          name: `${student.firstName} ${student.lastName}`,
        },
      };
    }

    // If already requested, inform
    const alreadyRequested = await this.model.findOne({
      _id: new Types.ObjectId(student._id),
      pendingParents: { $in: [new Types.ObjectId(parent._id)] },
    });

    if (alreadyRequested) {
      return { message: 'Request already sent and awaiting approval' };
    }

    // Add parent to student's pendingParents
    await this.model.updateOne(
      { _id: new Types.ObjectId(student._id) },
      { $addToSet: { pendingParents: new Types.ObjectId(parent._id) } },
    );

    return {
      message: 'Parent request sent. Student must approve to link child.',
      student: {
        id: student._id,
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
      },
    };
  }

  /**
   * Search students for a parent to add (aggregation-based).
   *
   * @param parentId - MongoDB ID of the parent
   * @param search - search query string
   * @returns matching students with requestSent flag
   */
  async searchStudentsForParent(
    parentId: MongoIdDto['id'],
    search: SearchDto['search'],
  ) {
    // Ensure parent exists & is allowed
    const parent = await this.model.findById(parentId);
    if (!parent) throw new NotFoundException('Parent not found');
    if (parent.role !== UserRole.Parent) {
      throw new ForbiddenException('Only parents can search for students');
    }

    const parentObjId = new Types.ObjectId(parentId);
    const regex = new RegExp(search ?? '', 'i');

    const results = await this.model.aggregate([
      // 1️. Match students only
      {
        $match: {
          role: UserRole.Student,
        },
      },

      // 2️. Search by studentId / name / email
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

      // 3️. Ensure pendingParents logic
      {
        $match: {
          $or: [
            { pendingParents: { $exists: false } },
            { pendingParents: { $size: 0 } },
            { pendingParents: parentObjId },
          ],
        },
      },

      // 4️. Compute requestSent flag
      {
        $addFields: {
          requestSent: {
            $cond: [
              {
                $in: [parentObjId, { $ifNull: ['$pendingParents', []] }],
              },
              true,
              false,
            ],
          },
        },
      },

      // 5️. Shape response
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          studentId: 1,
          email: 1,
          avatar: 1,
          requestSent: 1,
        },
      },

      // 6️. Limit results
      { $limit: 20 },
    ]);

    return {
      message: 'Search completed',
      results,
    };
  }

  /**
   * List connected children (students) for a parent.
   *
   * @param parentId - the MongoDB ID of the parent user
   * @return array of student user documents who are children of the parent
   */
  async listChildrenOfParent(parentId: MongoIdDto['id']) {
    const parentObjId = new Types.ObjectId(parentId);

    const result = await this.model.aggregate([
      // 1. Match parent
      {
        $match: {
          _id: parentObjId,
          role: UserRole.Parent,
        },
      },

      // 2. Connected children
      {
        $lookup: {
          from: 'users',
          localField: 'children',
          foreignField: '_id',
          as: 'connectedChildren',
          pipeline: [
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                avatar: 1,
                studentId: 1,
                status: { $literal: 'CONNECTED' },
              },
            },
          ],
        },
      },

      // 3. Pending children
      {
        $lookup: {
          from: 'users',
          let: { parentId: '$_id' },
          as: 'pendingChildren',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$role', UserRole.Student] },
                    {
                      $in: ['$$parentId', { $ifNull: ['$pendingParents', []] }],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                avatar: 1,
                studentId: 1,
                status: { $literal: 'PENDING' },
              },
            },
          ],
        },
      },

      // 4. Merge both into `children`
      {
        $addFields: {
          children: {
            $concatArrays: ['$connectedChildren', '$pendingChildren'],
          },
        },
      },

      // 5. Counts
      {
        $addFields: {
          connectedCount: { $size: '$connectedChildren' },
          pendingCount: { $size: '$pendingChildren' },
          totalCount: {
            $add: [
              { $size: '$connectedChildren' },
              { $size: '$pendingChildren' },
            ],
          },
        },
      },

      // 6. Final projection
      {
        $project: {
          _id: 0,
          children: 1,
          counts: {
            connected: '$connectedCount',
            pending: '$pendingCount',
            total: '$totalCount',
          },
        },
      },
    ]);

    if (!result.length) {
      throw new NotFoundException('Parent not found');
    }

    return {
      message: 'Children list retrieved',
      children: result[0].children,
      counts: result[0].counts,
    };
  }

  /**
   * List connected parents for a student (student view).
   *
   * @param studentId - the MongoDB ID of the student user
   * @return array of parent user documents who are connected to the student
   */
  async listParentsOfStudent(studentId: MongoIdDto['id']) {
    const student = await this.model
      .findById(studentId)
      .populate('parents', 'firstName lastName email avatar')
      .lean();
    if (!student) throw new NotFoundException('Student not found');
    return {
      message: 'Parents list retrieved',
      parents: student.parents || [],
    };
  }

  /**
   * List pending parent requests for a student (student view).
   *
   * @param studentId - the MongoDB ID of the student user
   * @return array of parent user documents who have requested to be added as a parent
   */
  async listPendingParentRequests(studentId: MongoIdDto['id']) {
    const student = await this.model
      .findById(studentId)
      .populate('pendingParents', 'firstName lastName email avatar')
      .lean();
    if (!student) throw new NotFoundException('Student not found');

    return {
      message: 'Pending parent requests retrieved',
      requests: student.pendingParents || [],
    };
  }

  /**
   * Student responds to a parent request (accept/reject).
   *
   * @param studentId - the MongoDB ID of the student user
   * @param parentId - the MongoDB ID of the parent user
   * @param accept - boolean indicating whether to accept or decline the request
   * @return a message indicating the result
   */
  async respondToParentRequest(
    studentId: MongoIdDto['id'],
    parentId: MongoIdDto['id'],
    accept: RespondToParentRequestDto['accept'],
  ) {
    const student = await this.model.findById(studentId);
    if (!student) throw new NotFoundException('Student not found');
    if (student.role !== UserRole.Student)
      throw new ForbiddenException(
        'Only students can respond to parent requests',
      );

    const parent = await this.model.findById(parentId);
    if (!parent) throw new NotFoundException('Parent not found');
    if (parent.role !== UserRole.Parent)
      throw new BadRequestException('Provided user is not a parent');

    // Ensure there is a pending request
    const isPending = (student.pendingParents || []).some((p: any) =>
      new Types.ObjectId(p).equals(parent._id),
    );
    if (!isPending) {
      throw new BadRequestException('No pending request from this parent');
    }

    // Remove pending regardless of accept/decline
    await this.model.updateOne(
      { _id: student._id },
      { $pull: { pendingParents: new Types.ObjectId(parent._id) } },
    );

    if (accept) {
      // add student to parent's children and add parent to student's parents
      await this.model.updateOne(
        { _id: parent._id },
        { $addToSet: { children: new Types.ObjectId(student._id) } },
      );
      await this.model.updateOne(
        { _id: student._id },
        { $addToSet: { parents: new Types.ObjectId(parent._id) } },
      );
      return { message: 'Parent request accepted' };
    }

    return { message: 'Parent request declined' };
  }

  /**
   * Change the authenticated user's password.
   *
   * @param req - the request object that contains `user` (set by auth guard)
   * @param data - object containing `newPassword` property
   * @returns an object with a message on success
   */
  async updatePassword(user: any, data: UpdatePasswordDto) {
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
