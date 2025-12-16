import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

export enum UserRole {
  Tutor = 'Tutor',
  Student = 'Student',
  Parent = 'Parent',
  Admin = 'Admin',
}

@Schema()
export class User extends Document {
  @Prop()
  avatar: string;

  @Prop()
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

  // Optional fields
  @Prop()
  token: string;

  @Prop()
  bio: string;

  @Prop()
  dbsLink: string;

  @Prop()
  referralSource: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

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
