import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ChatGroup extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId; // class reference

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  parentIds: Types.ObjectId[];

  @Prop({ required: true, enum: ['MATH', 'SCIENCE', 'ENGLISH'] })
  subject: string;

  // Chat can start after this time in this group
  @Prop({ required: true })
  startsAt: Date;
}

export const ChatGroupSchema = SchemaFactory.createForClass(ChatGroup);

/**
 * One booking = one chat group
 */
ChatGroupSchema.index({ booking: 1 }, { unique: true });
