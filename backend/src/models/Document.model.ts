import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DocumentUpload extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  url: string; // file path or url

  @Prop({ required: true })
  key: string; // S3 object key

  @Prop({ required: true })
  contentType: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  size: number; // in bytes

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const DocumentUploadSchema =
  SchemaFactory.createForClass(DocumentUpload);
