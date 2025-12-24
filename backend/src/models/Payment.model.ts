import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true, index: true })
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
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    required: true,
    default: 'PENDING',
  })
  status: string;

  @Prop({ required: true, unique: true, index: true })
  transactionId: string;

  // In smallest currency unit (e.g., )
  @Prop({ required: true, default: 0 })
  commission: number;

  // In smallest currency unit (e.g., )
  @Prop({ required: true, default: 0 })
  tutorEarning: number;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ booking: 1, tutor: 1, status: 1 });
PaymentSchema.index({ createdAt: -1 });
