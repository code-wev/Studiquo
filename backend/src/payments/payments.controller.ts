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
import { Model, Types } from 'mongoose';
import { Payment } from 'src/models/Payment.model';
import { Wallet } from 'src/models/Wallet.model';
import { Booking } from '../models/Booking.model';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
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
        this.logger.log('Payment succeeded:', event.data.object.id);
        const bookingId = event.data.object.metadata?.bookingId;
        const studentId = event.data.object.metadata?.studentId;
        const tutorId = event.data.object.metadata?.tutorId;
        const amount = event.data.object.amount_received;
        const currency = event.data.object.currency;
        if (bookingId) {
          try {
            // amount is in smallest currency unit (cents)
            const amt = Number(amount) || 0;
            const commission = Math.round(amt * 0.2); // 20% commission
            const tutorEarning = Math.max(0, amt - commission);

            // Create payment record including commission and tutor earning
            const paymentDoc = await this.paymentModel.create({
              booking: bookingId,
              student: studentId,
              tutor: tutorId,
              amount: amt,
              currency,
              method: 'stripe',
              status: 'COMPLETED',
              transactionId: event.data.object.id,
              commission,
              tutorEarning,
            });

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
                this.logger.log(
                  `Credited tutor ${tutorObjectId} wallet by ${tutorEarning} (new balance ${wallet.balance})`,
                );
              }
            } catch (err: any) {
              this.logger.error('Failed to credit tutor wallet', err.message);
            }

            await this.bookingModel.findByIdAndUpdate(
              bookingId,
              { status: 'SCHEDULED' },
              { new: true },
            );

            this.logger.log(`Booking ${bookingId} updated to SCHEDULED`);
          } catch (e: any) {
            this.logger.error('Failed to update booking status', e.message);
          }
        }
        break;
      }
      case 'payment_intent.payment_failed': {
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
            await this.paymentModel.create({
              booking: bookingId,
              student: studentId,
              tutor: tutorId,
              amount: amt,
              currency,
              method: 'stripe',
              status: 'FAILED',
              transactionId: event.data.object.id,
              commission: 0,
              tutorEarning: 0,
            });

            await this.bookingModel.findByIdAndUpdate(
              bookingId,
              { status: 'CANCELLED' },
              { new: true },
            );

            this.logger.log(`Booking ${bookingId} updated to CANCELLED`);
          } catch (e: any) {
            this.logger.error('Failed to update booking status', e.message);
          }
        }
        break;
      }
      case 'checkout.session.completed': {
        // Handle Checkout Session completion
        this.logger.log('Checkout session completed:', event.data.object.id);
        const bookingId = event.data.object.metadata?.bookingId;
        if (bookingId) {
          try {
            await this.bookingModel.findByIdAndUpdate(
              bookingId,
              { status: 'SCHEDULED' },
              { new: true },
            );
            this.logger.log(
              `Booking ${bookingId} updated to SCHEDULED via Checkout`,
            );
          } catch (e: any) {
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
