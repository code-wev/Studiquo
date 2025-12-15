import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class TutorAvailability extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  date: Date;
}

export const TutorAvailabilitySchema =
  SchemaFactory.createForClass(TutorAvailability);

// Compound index for frequent query
TutorAvailabilitySchema.index({ user: 1, date: 1 }, { unique: true });
