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
    currency: string = 'eur',
    metadata?: Record<string, string>,
  ) {
    // eru payment intent
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents
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
}
