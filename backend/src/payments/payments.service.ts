import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = process.env.STRIPE_CURRENCY || 'gbp', // Pound sterling GBP not supported in Stripe test mode
    metadata?: Record<string, string>,
  ) {
    // eru payment intent
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in pennies
      currency,
      metadata,
    });
  }

  async createCheckoutSession(options: {
    amount: number;
    currency?: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
    customerEmail?: string;
    description?: string;
  }) {
    const {
      amount,
      currency = 'eur',
      successUrl,
      cancelUrl,
      metadata,
      customerEmail,
      description,
    } = options;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: description || 'Lesson booking',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      customer_email: customerEmail,
    });

    return session;
  }

  async constructEvent(
    payload: string | Buffer,
    sig: string,
    endpointSecret: string,
  ) {
    return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  }

  /**
   * Refund a payment on Stripe.
   * @param paymentIntentId - Stripe PaymentIntent or Charge id stored in `transactionId`
   * @param amount - optional amount in main currency units (e.g., GBP). If provided, a partial
   * refund will be issued for this amount. Otherwise full refund issued.
   */
  async refundPayment(paymentIntentId: string, amount?: number) {
    const params: Stripe.RequestOptions = {} as any;

    const refundData: any = {};

    // If amount provided, convert to cents/pence
    if (typeof amount === 'number' && amount > 0) {
      refundData.amount = Math.round(amount * 100);
    }

    // Prefer refund by payment_intent id
    refundData.payment_intent = paymentIntentId;

    return await this.stripe.refunds.create(refundData, params);
  }
}
