import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class StudentProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true })
  yearGroup: string;

  @Prop({ type: String, default: '' })
  confidenceLevel: string;

  @Prop({ type: String, default: '' })
  currentGrade: string;
  
  @Prop({ type: String, default: '' })
  targetGrade: string;
}

export const StudentProfileSchema = SchemaFactory.createForClass(StudentProfile);
