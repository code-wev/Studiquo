import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { ChatGroup } from 'src/models/ChatGroup.model';
import { Payment } from 'src/models/Payment.model';
import { Wallet } from 'src/models/Wallet.model';
import { Booking } from '../models/Booking.model';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly mailService: MailService,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(ChatGroup.name) private chatGroupModel: Model<ChatGroup>,
  ) {}

  /**
   * Get Stripe publishable key for client-side use.
   */
  @Get('config')
  getConfig() {
    return {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    };
  }

  /**
   * Create a Stripe PaymentIntent for a booking.
   */
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency?: string; bookingId?: string },
  ) {
    const { amount, currency = 'eur', bookingId } = body;
    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }
    const metadata = bookingId ? { bookingId: String(bookingId) } : undefined;
    const paymentIntent = await this.paymentsService.createPaymentIntent(
      amount,
      currency,
      metadata,
    );
    return { clientSecret: paymentIntent.client_secret, id: paymentIntent.id };
  }

  /**
   * Stripe webhook endpoint.
   */
  @Post('webhook')
  async handleWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: any;

    try {
      event = this.paymentsService.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
      this.logger.error('Webhook signature verification failed.', err.message);
      throw new BadRequestException('Webhook signature verification failed.');
    }

    this.logger.log(`Received webhook event ${event.type}`);

    switch (event.type) {

      
      case 'payment_intent.succeeded': {
        console.log(event, 'success event');
        this.logger.log('Payment succeeded:', event.data.object.id);
        const bookingId = event.data.object.metadata?.bookingId;
        const studentId = event.data.object.metadata?.studentId;
        const tutorId = event.data.object.metadata?.tutorId;
        const parentIds = event.data.object.metadata?.parentIds;
        const slotEndTime = event.data.object.metadata?.slotEndTime;
        const subject = event.data.object.metadata?.subject;
        const parentEmail = event.data.object.metadata?.parentEmail;
        const shortBookingId = event.data.object.metadata?.shortBookingId;
        const amount = event.data.object.amount_received;
        const currency = event.data.object.currency;
        if (bookingId) {
          try {
            // amount is in smallest currency unit (cents)
            const amt = Number(amount) || 0;
            const commission = Math.round(amt * 0.2); // 20% commission
            const tutorEarning = Math.max(0, amt - commission);

            // Create payment record including commission and tutor earning
            const payment = await this.paymentModel.create({
              booking: new Types.ObjectId(bookingId),
              student: new Types.ObjectId(studentId),
              tutor: new Types.ObjectId(tutorId),
              amount: amt,
              currency,
              method: 'stripe',
              status: 'COMPLETED',
              transactionId: event.data.object.id,
              commission,
              tutorEarning,
            });

            console.log(event, 'event data after payment record');
            console.log(payment, 'payment data after payment');
            this.logger.log(
              `Payment record created for booking ${bookingId} with amount ${amt}, commission ${commission}, tutor earning ${tutorEarning}`,
            );

            // Credit tutor wallet (create if missing)
            try {
              const tutorObjectId = tutorId ? tutorId : null;
              if (tutorObjectId) {
                const wallet = await this.walletModel.findOneAndUpdate(
                  { tutorId: new Types.ObjectId(tutorObjectId) },
                  {
                    $inc: { balance: tutorEarning },
                    $set: { updatedAt: new Date() },
                  },
                  { upsert: true, new: true },
                );
                console.log(wallet, 'wallet data after the payment');
                this.logger.log(
                  `Credited tutor ${tutorObjectId} wallet by ${tutorEarning} (new balance ${wallet.balance})`,
                );
              }
            } catch (err: any) {
              console.log('Failed to credit tutor wallet', err.message);
              this.logger.error('Failed to credit tutor wallet', err.message);
            }

            const booking = await this.bookingModel.findByIdAndUpdate(
              new Types.ObjectId(bookingId),
              { status: 'SCHEDULED' },
              { new: true },
            );

            console.log(booking, 'booking data after successful payment');
            this.logger.log(`Booking ${bookingId} updated to SCHEDULED`);

            // check the chat group exist or not with the same tutor, student and booking
            const existingChatGroup = await this.chatGroupModel.findOne({
              tutorId: new mongoose.Types.ObjectId(tutorId),
              studentId: new mongoose.Types.ObjectId(studentId),
              // Single parentId or multiple parentIds if one parent is matched then okay
              parentIds: {
                $in: parentIds
                  ? parentIds
                      .split(',')
                      .map((id: string) => new mongoose.Types.ObjectId(id))
                  : [],
              },
              subject: subject,
            });

            if (existingChatGroup) {
              this.logger.log(
                `Chat group already exists for subject: ${subject}, tutor ${tutorId}, student ${studentId}`,
              );
              return { received: true };
            }

            console.log(
              existingChatGroup,
              'existing chat group data after check',
            );

            // Create chat group for the booking
            const chatGroup = await this.chatGroupModel.create({
              booking: new mongoose.Types.ObjectId(bookingId),
              tutorId: new mongoose.Types.ObjectId(tutorId),
              studentId: new mongoose.Types.ObjectId(studentId),
              parentIds: parentIds
                ? parentIds
                    .split(',')
                    .map((id: string) => new mongoose.Types.ObjectId(id))
                : [],
              subject: event.data.object.metadata?.subject,
              startsAt: new Date(slotEndTime),
            });

            console.log(chatGroup, 'chat group data after creation');
            this.logger.log(
              `Chat group created for subject: ${subject}, tutor ${tutorId}, student ${studentId}`,
            );
            await this.logger.log(`Booking ${bookingId} updated to SCHEDULED`);

            await this.mailService.sendPaymentConfirmationEmail(
              parentEmail,
              amt,
              currency,
              shortBookingId,
            );
          } catch (e: any) {
            console.log('Failed to update booking status', e.message);
            this.logger.error('Failed to update booking status', e.message);
          }
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        console.log(event, 'event data on failed payment');

        this.logger.log('Payment failed:', event.data.object.id);
        const bookingId = event.data.object.metadata?.bookingId;
        const studentId = event.data.object.metadata?.studentId;
        const tutorId = event.data.object.metadata?.tutorId;
        const amount = event.data.object.amount;
        const currency = event.data.object.currency;
        if (bookingId) {
          try {
            const amt = Number(amount) || 0;
            // For failed payments, commission and tutor earnings are zero
            const payment = await this.paymentModel.create({
              booking: new Types.ObjectId(bookingId),
              student: new Types.ObjectId(studentId),
              tutor: new Types.ObjectId(tutorId),
              amount: amt,
              currency,
              method: 'stripe',
              status: 'FAILED',
              transactionId: event.data.object.id,
              commission: 0,
              tutorEarning: 0,
            });

            const booking = await this.bookingModel.findByIdAndUpdate(
              new Types.ObjectId(bookingId),
              { status: 'CANCELLED' },
              { new: true },
            );

            console.log(payment, 'payment data after failed payment');
            console.log(booking, 'booking data after failed payment');

            this.logger.log(`Booking ${bookingId} updated to CANCELLED`);
          } catch (e: any) {
            this.logger.error('Failed to update booking status', e.message);
          }
        }
        break;
      }
      case 'checkout.session.completed': {
        // Handle Checkout Session completion
        console.log(event, 'event data on checkout session completed');

        this.logger.log('Checkout session completed:', event.data.object.id);
        const bookingId = event.data.object.metadata?.bookingId;
        if (bookingId) {
          try {
            const booking = await this.bookingModel.findByIdAndUpdate(
              new Types.ObjectId(bookingId),
              { status: 'SCHEDULED' },
              { new: true },
            );
            this.logger.log(
              `Booking ${bookingId} updated to SCHEDULED via Checkout`,
            );

            console.log(booking, 'booking data after checkout completed');
          } catch (e: any) {

            console.log('Failed to update booking status from checkout',
              e.message);
            this.logger.error(
              'Failed to update booking status from checkout',
              e.message,
            );
          }
        }
        break;
      }
      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
