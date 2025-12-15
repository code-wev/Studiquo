import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class LessonReport extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: Boolean, default: false })
  submitted: boolean;
}

export const LessonReportSchema = SchemaFactory.createForClass(LessonReport);
