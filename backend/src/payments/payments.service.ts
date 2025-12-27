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
   * @param transactionId - PaymentIntent ID (pi_), Charge ID (ch_), or Checkout Session ID (cs_)
   * @param amount - Optional amount in main currency units (e.g. GBP). If not provided, full refund.
   */
  async refundPayment(
    transactionId: string,
    amount?: number,
  ): Promise<Stripe.Refund> {
    let paymentIntentId: string | undefined;

    // 1️⃣ Checkout Session (cs_)
    if (transactionId.startsWith('cs_')) {
      const session = await this.stripe.checkout.sessions.retrieve(
        transactionId,
        { expand: ['payment_intent'] },
      );

      if (!session.payment_intent) {
        throw new Error('No payment_intent found on checkout session');
      }

      paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent.id;
    }

    // 2️⃣ PaymentIntent (pi_)
    else if (transactionId.startsWith('pi_')) {
      paymentIntentId = transactionId;
    }

    // 3️⃣ Charge (ch_) → get PaymentIntent
    else if (transactionId.startsWith('ch_')) {
      const charge = await this.stripe.charges.retrieve(transactionId);

      if (!charge.payment_intent) {
        throw new Error('Charge does not have an attached payment_intent');
      }

      paymentIntentId = charge.payment_intent as string;
    } else {
      throw new Error('Invalid Stripe transaction id');
    }

    // Refund params
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    // Partial refund
    if (typeof amount === 'number' && amount > 0) {
      refundParams.amount = Math.round(amount * 100); // convert to cents/pence
    }

    return this.stripe.refunds.create(refundParams);
  }
}
