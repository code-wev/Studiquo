import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class TimeSlot extends Document {
  @Prop({ type: Types.ObjectId, ref: 'TutorAvailability', required: true })
  tutorAvailability: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true, enum: ['ONE_TO_ONE', 'GROUP'], default: 'GROUP' })
  type: string;

  @Prop({ default: false })
  isBooked: boolean;

  @Prop()
  meetLink: string;
}

export const TimeSlotSchema = SchemaFactory.createForClass(TimeSlot);

TimeSlotSchema.index({ tutorAvailability: 1, startTime: 1 });
TimeSlotSchema.index({ isBooked: 1 });
