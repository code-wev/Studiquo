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

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  transactionId: string;

  @Prop({ required: true })
  commission: number;

  @Prop({ required: true })
  tutorEarning: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
