import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  tutorId: Types.ObjectId;

  // British Pounds Sterling (GBP) in smallest currency unit (pence)
  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: 'gbp' })
  currency: string;

  @Prop({
    type: [
      {
        amount: { type: Number, required: true },
        type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
        description: String,
        reference: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  })
  transactions: {
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    description?: string;
    reference?: string;
    createdAt: Date;
  }[];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.index({ tutorId: 1 });
WalletSchema.index({ updatedAt: -1 });
