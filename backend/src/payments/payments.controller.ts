import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Post,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

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
    @Body() body: { amount: number; currency?: string },
  ) {
    const { amount, currency = 'usd' } = body;
    if (!amount || amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }
    const paymentIntent = await this.paymentsService.createPaymentIntent(
      amount,
      currency,
    );
    return { clientSecret: paymentIntent.client_secret };
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
    let event;

    try {
      event = this.paymentsService.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      this.logger.error('Webhook signature verification failed.', err.message);
      throw new BadRequestException('Webhook signature verification failed.');
    }

    this.logger.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        this.logger.log('Payment succeeded:', event.data.object.id);
        // TODO: Update booking status, send confirmation, etc.
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        this.logger.log('Payment failed:', event.data.object.id);
        // TODO: Handle failure
        break;
      default:
        this.logger.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }
}
