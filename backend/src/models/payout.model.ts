import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Payout extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutorId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  transactionId: string;
}

export const PayoutSchema = SchemaFactory.createForClass(Payout);
