import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
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
