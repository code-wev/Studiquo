import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';

export enum UserRole {
  Tutor = 'Tutor',
  Student = 'Student',
  Parent = 'Parent',
  Admin = 'Admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  avatarKey: string; // S3 object key

  @Prop({ default: '' })
  googleId: string;

  @Prop({ unique: true, sparse: true })
  studentId?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  /**
   * Parent → Children mapping
   * Only for Parent role
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  children?: Types.ObjectId[];

  /**
   * For Student role: list of parent ids who are already approved
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  parents?: Types.ObjectId[];

  /**
   * For Student role: parent requests that are awaiting student's approval
   */
  @Prop({
    type: [Types.ObjectId],
    ref: 'User',
    default: [],
  })
  pendingParents?: Types.ObjectId[];

  // Optional fields
  @Prop({ default: '' })
  token: string;

  @Prop({ required: false })
  tokenExpiry?: Date;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  dbsLink: string;

  @Prop({ default: '' })
  referralSource: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ role: 1, pendingParents: 1 });

/**
 * Generate unique Student ID after user creation
 */
UserSchema.post('save', async function (doc: User) {
  if (doc.role !== UserRole.Student) return;
  if (doc.studentId) return;

  const UserModel = this.constructor as Model<User>;

  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  const studentId = `STU-${year}-${random}`;

  await UserModel.updateOne({ _id: doc._id }, { $set: { studentId } });
});
