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
import { Model } from 'mongoose';
import { Booking } from '../models/booking.model';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
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
    const { amount, currency = 'usd', bookingId } = body;
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
        if (bookingId) {
          try {
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
        if (bookingId) {
          try {
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
