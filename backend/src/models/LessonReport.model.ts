import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum LessonReportFileType {
  PDF = 'PDF',
  TEXT = 'TEXT',
  WORD = 'WORD',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

@Schema({ _id: false })
export class LessonReportContent {
  @Prop({
    required: true,
    enum: LessonReportFileType,
  })
  type: LessonReportFileType;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  key: string; // S3 object key

  @Prop()
  originalName?: string;

  @Prop()
  mimeType?: string;

  @Prop()
  size?: number; // bytes

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  uploadedBy: Types.ObjectId; // User who uploaded the content - tutor
}

@Schema({ timestamps: true })
export class LessonReport extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [LessonReportContent], default: [] })
  contents: LessonReportContent[];
}

export const LessonReportSchema = SchemaFactory.createForClass(LessonReport);
