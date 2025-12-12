import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'TimeSlot', required: true })
  timeSlot: Types.ObjectId;

  @Prop({ required: true, enum: ['MATH', 'SCIENCE', 'ENGLISH'] })
  subject: string;

  @Prop({ required: true, enum: ['ONE_TO_ONE', 'GROUP'], default: 'GROUP' })
  type: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, enum: ['SCHEDULED', 'CANCELLED', 'COMPLETED'] })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
