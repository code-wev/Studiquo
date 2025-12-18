import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ChatGroup extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId; // class reference

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  parentIds: Types.ObjectId[];

  @Prop({ required: true })
  subject: string;

  /**
   * Chat will be auto-deleted by MongoDB TTL
   */
  @Prop({ required: true })
  expiresAt: Date;
}

export const ChatGroupSchema = SchemaFactory.createForClass(ChatGroup);

/**
 * One booking = one chat group
 */
ChatGroupSchema.index({ booking: 1 }, { unique: true });

/**
 * TTL index → auto delete chat group at expiresAt
 */
ChatGroupSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
