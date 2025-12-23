import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tutorId: Types.ObjectId;

  // stored in smallest currency unit (Pound sterling GBP not supported in Stripe test mode)
  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: 'gbp' })
  currency: string;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
