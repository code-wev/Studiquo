import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TimeSlotType } from './TimeSlot.model';
import { TutorSubject } from './TutorProfile.model';

@Schema()
export class Booking extends Document {
  @Prop({ type: Types.ObjectId, ref: 'TimeSlot', required: true })
  timeSlot: Types.ObjectId;

  @Prop({ required: true, enum: TutorSubject })
  subject: TutorSubject;

  @Prop({ required: true, enum: TimeSlotType, default: TimeSlotType.GROUP })
  type: TimeSlotType;

  @Prop({
    required: true,
    enum: ['PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING',
  })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
