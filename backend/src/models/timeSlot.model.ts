import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TutorSubject } from './TutorProfile.model';

export enum TimeSlotType {
  ONE_TO_ONE = 'ONE_TO_ONE',
  GROUP = 'GROUP',
}

@Schema()
export class TimeSlot extends Document {
  @Prop({ type: Types.ObjectId, ref: 'TutorAvailability', required: true })
  tutorAvailability: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({
    type: String,
    enum: TutorSubject,
  })
  subject: TutorSubject;

  @Prop({ required: true, enum: TimeSlotType, default: TimeSlotType.GROUP })
  type: TimeSlotType;

  @Prop()
  meetLink: string;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);

TimeSlotSchema.index({ tutorAvailability: 1, startTime: 1 });
TimeSlotSchema.index({ isBooked: 1 });
