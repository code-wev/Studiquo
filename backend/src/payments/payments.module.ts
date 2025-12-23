import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from 'src/mail/mail.service';
import { Booking, BookingSchema } from 'src/models/Booking.model';
import { ChatGroup, ChatGroupSchema } from 'src/models/ChatGroup.model';
import { Payment, PaymentSchema } from 'src/models/Payment.model';
import { Wallet, WalletSchema } from 'src/models/Wallet.model';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

/**
 * Payments feature module.
 *
 * Registers the `Booking`, `Payment`, `Wallet` and `ChatGroup` schemas and
 * exposes the `PaymentsService` and `PaymentsController` for the app.
 */
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
  providers: [PaymentsService, MailService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
