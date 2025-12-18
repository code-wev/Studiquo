import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  DOCUMENT = 'DOCUMENT',
  PDF = 'PDF',
}

@Schema()
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

  /**
   * Same expiry as ChatGroup
   * MongoDB TTL will auto delete messages
   */
  @Prop({ required: true })
  expiresAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ chatGroup: 1, createdAt: -1 });

/**
 * Fast message fetch
 */

/**
 * TTL index → auto delete messages
 */
MessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Pre-validate hook to set expiresAt from ChatGroup
 */
MessageSchema.pre(
  'validate',
  async function (
    this: Document & { expiresAt?: Date; chatGroup?: Types.ObjectId },
    next: (err?: Error) => void,
  ) {
    try {
      if (this.get('expiresAt')) return next();

      const ChatGroupModel = this.model('ChatGroup');
      const chatGroup = (await ChatGroupModel.findById(this.get('chatGroup'))
        .select('expiresAt')
        .exec()) as { expiresAt: Date } | null;

      if (!chatGroup) {
        return next(new Error('ChatGroup not found'));
      }

      this.set('expiresAt', chatGroup.expiresAt);
      return next();
    } catch (err) {
      return next(err as Error);
    }
  },
);
