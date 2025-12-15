import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class DocumentUpload extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  dbs: string; // file path or url

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

export const DocumentUploadSchema =
  SchemaFactory.createForClass(DocumentUpload);
