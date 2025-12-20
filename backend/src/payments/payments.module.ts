import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from 'src/models/Booking.model';
import { ChatGroup, ChatGroupSchema } from 'src/models/ChatGroup.model';
import { Payment, PaymentSchema } from 'src/models/Payment.model';
import { Wallet, WalletSchema } from 'src/models/Wallet.model';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: ChatGroup.name, schema: ChatGroupSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
