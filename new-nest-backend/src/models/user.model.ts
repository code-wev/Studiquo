import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['Tutor', 'Student', 'Parent', 'Admin'] })
  role: string;

  @Prop()
  bio: string;

  @Prop()
  dbsLink: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
