import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TutorSubject {
  MATH = 'MATH',
  SCIENCE = 'SCIENCE',
  ENGLISH = 'ENGLISH',
}

@Schema()
export class TutorProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [String],
    enum: TutorSubject,
  })
  subjects: TutorSubject[];

  // hourly rate in euros for group lessons
  @Prop({ required: true })
  groupHourlyRate: number;

  // hourly rate in euros for one-on-one lessons
  @Prop({ required: true })
  oneOnOneHourlyRate: number;
}

export const TutorProfileSchema = SchemaFactory.createForClass(TutorProfile);
