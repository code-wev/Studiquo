import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Payment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutor: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  // Pound sterling GBP not supported in Stripe test mode
  @Prop({ required: true, default: 'gbp' })
  currency: string;

  @Prop({ required: true })
  method: string;

  @Prop({
    type: String,
    enum: ['COMPLETED', 'FAILED'],
    required: true,
  })
  status: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true, default: 0 })
  commission: number;

  @Prop({ required: true, default: 0 })
  tutorEarning: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
