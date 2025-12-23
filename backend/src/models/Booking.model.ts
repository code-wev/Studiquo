import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { TimeSlotType } from './TimeSlot.model';
import { TutorSubject } from './TutorProfile.model';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ unique: true, sparse: true })
  bookingId: string;

  @Prop({ type: Types.ObjectId, ref: 'TimeSlot', required: true })
  timeSlot: Types.ObjectId;

  @Prop({ required: true, enum: TutorSubject })
  subject: TutorSubject;

  @Prop({ required: true, enum: TimeSlotType, default: TimeSlotType.GROUP })
  type: TimeSlotType;

  @Prop({
    required: true,
    enum: ['PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED'],
    default: 'PENDING',
  })
  status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

/**
 * Generate unique Booking ID after booking creation
 * Format: BK-YYYYMM-XXXXXX
 * Example: BK-202512-3F9A2C
 */
BookingSchema.post('save', async function (doc: Booking) {
  const BookingModel = this.constructor as Model<Booking>;

  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  const bookingId = `BK-${year}-${random}`;

  await BookingModel.updateOne({ _id: doc._id }, { $set: { bookingId } });
});
