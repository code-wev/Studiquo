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

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return await this.stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency,
    });
  }

  async constructEvent(
    payload: string | Buffer,
    sig: string,
    endpointSecret: string,
  ) {
    return this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  }
}
