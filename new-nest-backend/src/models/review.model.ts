import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Review extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Booking',
    required: false,
    default: null,
  })
  booking: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false, default: null })
  student: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutor: Types.ObjectId;

  @Prop({ min: 1, max: 5, required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
