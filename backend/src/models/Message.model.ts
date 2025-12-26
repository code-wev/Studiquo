import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum MessageType {
  TEXT = 'TEXT',
  TEXT_AND_IMAGE = 'TEXT_AND_IMAGE',
  IMAGE = 'IMAGE',
  TEXT_AND_VIDEO = 'TEXT_AND_VIDEO',
  VIDEO = 'VIDEO',
  TEXT_AND_AUDIO = 'TEXT_AND_AUDIO',
  AUDIO = 'AUDIO',
  TEXT_AND_FILE = 'TEXT_AND_FILE',
  FILE = 'FILE',
  TEXT_AND_DOCUMENT = 'TEXT_AND_DOCUMENT',
  DOCUMENT = 'DOCUMENT',
  TEXT_AND_PDF = 'TEXT_AND_PDF',
  PDF = 'PDF',
}

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'ChatGroup', required: true })
  chatGroup: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @Prop({
    type: String,
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;

  @Prop({ required: false })
  fileUrl?: string;

  @Prop({ required: false })
  fileName?: string;

  @Prop({ required: false })
  fileSize?: number;

  @Prop({ required: true })
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ chatGroup: 1, createdAt: -1 });
