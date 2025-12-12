import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class TutorProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [String], required: true })
  subjects: string[];

  @Prop({ required: true })
  hourlyRate: number;
}

export const TutorProfileSchema = SchemaFactory.createForClass(TutorProfile);
