import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
