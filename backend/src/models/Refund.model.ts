import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RefundStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

@Schema({ timestamps: true })
export class Refund extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Payment', required: true })
  payment: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  tutor: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'gbp' })
  currency: string;

  @Prop({ required: true, default: 'stripe' })
  method: string;

  @Prop({
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    required: true,
    default: 'PENDING',
  })
  status: RefundStatus;

  @Prop()
  stripeRefundId: string;

  @Prop()
  reason: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);

RefundSchema.index({ booking: 1 });
RefundSchema.index({ payment: 1 });
