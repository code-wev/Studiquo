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
   * @returns {Object} Object containing the Stripe publishable key
   */
  @Get('config')
  getConfig() {
    this.logger.log('Fetching Stripe configuration');
    return {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    };
  }

  /**
   * Create a Stripe PaymentIntent for a booking.
   * @param {Object} body - Request body containing amount, currency, and bookingId
   * @param {number} body.amount - Amount in smallest currency unit (cents)
   * @param {string} [body.currency='eur'] - Currency code
   * @param {string} [body.bookingId] - Optional booking ID
   * @returns {Promise<Object>} PaymentIntent client secret and ID
   * @throws {BadRequestException} If amount is invalid
   */
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency?: string; bookingId?: string },
  ) {
    const { amount, currency = 'eur', bookingId } = body;

    this.logger.debug(
      `Creating PaymentIntent: amount=${amount}, currency=${currency}, bookingId=${bookingId}`,
    );

    if (!amount || amount <= 0) {
      this.logger.warn('Invalid amount provided for PaymentIntent creation');
      throw new BadRequestException('Invalid amount');
    }

    const metadata = bookingId ? { bookingId: String(bookingId) } : undefined;

    const paymentIntent = await this.paymentsService.createPaymentIntent(
      amount,
      currency,
      metadata,
    );

    this.logger.log(`PaymentIntent created: ${paymentIntent.id}`);

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  }

  /**
   * Handle successful payment event.
   * @param {any} eventData - Stripe event data object
   * @param {string} transactionId - Stripe transaction ID
   * @returns {Promise<void>}
   */
  private async handleSuccessfulPayment(
    eventData: any,
    transactionId: string,
  ): Promise<void> {
    const metadata = eventData.metadata || {};
    const {
      bookingId,
      studentId,
      tutorId,
      parentIds,
      slotEndTime,
      subject,
      parentEmail,
      shortBookingId,
    } = metadata;

    const amount = eventData.amount_received || eventData.amount_total || 0;
    const currency = eventData.currency || 'eur';
    const amt = Number(amount) || 0;

    if (!bookingId) {
      this.logger.warn('No bookingId found in successful payment metadata');
      return;
    }

    this.logger.log(`Processing successful payment for booking ${bookingId}`);

    try {
      // Calculate commission and tutor earnings (20% commission)
      const commission = Math.round(amt * 0.2);
      const tutorEarning = Math.max(0, amt - commission);

      // Create payment record
      const payment = await this.paymentModel.create({
        booking: new Types.ObjectId(bookingId),
        student: studentId ? new Types.ObjectId(studentId) : undefined,
        tutor: tutorId ? new Types.ObjectId(tutorId) : undefined,
        amount: amt,
        currency,
        method: 'stripe',
        status: 'COMPLETED',
        transactionId,
        commission,
        tutorEarning,
      });

      this.logger.log(
        `Payment record created: ${payment._id}, amount: ${amt}, commission: ${commission}, tutor earning: ${tutorEarning}`,
      );

      // Credit tutor wallet
      if (tutorId) {
        await this.creditTutorWallet(tutorId, tutorEarning);
      }

      // Update booking status
      const booking = await this.bookingModel.findByIdAndUpdate(
        new Types.ObjectId(bookingId),
        { status: 'SCHEDULED' },
        { new: true },
      );

      this.logger.log(`Booking ${bookingId} status updated to SCHEDULED`);

      // Create chat group if needed
      if (tutorId && studentId && subject) {
        await this.createChatGroup(
          bookingId,
          tutorId,
          studentId,
          parentIds,
          subject,
          slotEndTime,
        );
      }

      // Send payment confirmation email
      if (parentEmail) {
        await this.sendPaymentConfirmationEmail(
          parentEmail,
          amt,
          currency,
          shortBookingId,
        );
      }

      this.logger.log(
        `Successfully processed payment for booking ${bookingId}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to process successful payment for booking ${bookingId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Handle failed payment event.
   * @param {any} eventData - Stripe event data object
   * @param {string} transactionId - Stripe transaction ID
   * @returns {Promise<void>}
   */
  private async handleFailedPayment(
    eventData: any,
    transactionId: string,
  ): Promise<void> {
    const metadata = eventData.metadata || {};
    const { bookingId, studentId, tutorId } = metadata;
    const amount = eventData.amount || 0;
    const currency = eventData.currency || 'eur';
    const amt = Number(amount) || 0;

    if (!bookingId) {
      this.logger.warn('No bookingId found in failed payment metadata');
      return;
    }

    this.logger.log(`Processing failed payment for booking ${bookingId}`);

    try {
      // Create failed payment record
      const payment = await this.paymentModel.create({
        booking: new Types.ObjectId(bookingId),
        student: studentId ? new Types.ObjectId(studentId) : undefined,
        tutor: tutorId ? new Types.ObjectId(tutorId) : undefined,
        amount: amt,
        currency,
        method: 'stripe',
        status: 'FAILED',
        transactionId,
        commission: 0,
        tutorEarning: 0,
      });

      this.logger.log(`Failed payment record created: ${payment._id}`);

      // Update booking status to CANCELLED
      await this.bookingModel.findByIdAndUpdate(
        new Types.ObjectId(bookingId),
        { status: 'CANCELLED' },
        { new: true },
      );

      this.logger.log(`Booking ${bookingId} status updated to CANCELLED`);
    } catch (error: any) {
      this.logger.error(
        `Failed to process failed payment for booking ${bookingId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Credit tutor wallet with earnings.
   * @param {string} tutorId - Tutor ID
   * @param {number} amount - Amount to credit
   * @returns {Promise<void>}
   */
  private async creditTutorWallet(
    tutorId: string,
    amount: number,
  ): Promise<void> {
    try {
      const wallet = await this.walletModel.findOneAndUpdate(
        { tutorId: new Types.ObjectId(tutorId) },
        {
          $inc: { balance: amount },
          $set: { updatedAt: new Date() },
        },
        { upsert: true, new: true },
      );

      this.logger.log(
        `Credited tutor ${tutorId} wallet by ${amount} (new balance: ${wallet.balance})`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to credit tutor ${tutorId} wallet: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Create chat group for booking if it doesn't exist.
   * @param {string} bookingId - Booking ID
   * @param {string} tutorId - Tutor ID
   * @param {string} studentId - Student ID
   * @param {string} parentIds - Comma-separated parent IDs
   * @param {string} subject - Subject
   * @param {string} slotEndTime - Slot end time
   * @returns {Promise<void>}
   */
  private async createChatGroup(
    bookingId: string,
    tutorId: string,
    studentId: string,
    parentIds: string,
    subject: string,
    slotEndTime: string,
  ): Promise<void> {
    try {
      const parentIdsArray = parentIds
        ? parentIds
            .split(',')
            .map((id: string) => new mongoose.Types.ObjectId(id))
        : [];

      // Check if chat group already exists
      const existingChatGroup = await this.chatGroupModel.findOne({
        tutorId: new mongoose.Types.ObjectId(tutorId),
        studentId: new mongoose.Types.ObjectId(studentId),
        parentIds: { $in: parentIdsArray },
        subject,
      });

      if (existingChatGroup) {
        this.logger.log(
          `Chat group already exists for subject: ${subject}, tutor: ${tutorId}, student: ${studentId}`,
        );
        return;
      }

      // Create new chat group
      const chatGroup = await this.chatGroupModel.create({
        booking: new mongoose.Types.ObjectId(bookingId),
        tutorId: new mongoose.Types.ObjectId(tutorId),
        studentId: new mongoose.Types.ObjectId(studentId),
        parentIds: parentIdsArray,
        subject,
        startsAt: new Date(slotEndTime),
      });

      this.logger.log(`Chat group created: ${chatGroup._id}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to create chat group for booking ${bookingId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Send payment confirmation email.
   * @param {string} parentEmail - Parent email address
   * @param {number} amount - Payment amount
   * @param {string} currency - Currency code
   * @param {string} shortBookingId - Short booking ID for reference
   * @returns {Promise<void>}
   */
  private async sendPaymentConfirmationEmail(
    parentEmail: string,
    amount: number,
    currency: string,
    shortBookingId: string,
  ): Promise<void> {
    try {
      await this.mailService.sendPaymentConfirmationEmail(
        parentEmail,
        amount,
        currency,
        shortBookingId,
      );
      this.logger.log(`Payment confirmation email sent to ${parentEmail}`);
    } catch (error: any) {
      this.logger.error(
        `Failed to send payment confirmation email to ${parentEmail}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Stripe webhook endpoint for handling payment events.
   * @param {Buffer} rawBody - Raw request body
   * @param {string} sig - Stripe signature from header
   * @returns {Promise<Object>} Acknowledgement response
   * @throws {BadRequestException} If signature verification fails
   */
  @Post('webhook')
  async handleWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    let event: any;

    this.logger.debug('Received webhook request');

    // Verify webhook signature
    try {
      event = await this.paymentsService.constructEvent(
        rawBody,
        sig,
        endpointSecret,
      );
      this.logger.debug(`Webhook event constructed: ${event.type}`);
    } catch (error: any) {
      this.logger.error(
        `Webhook signature verification failed: ${error.message}`,
      );
      throw new BadRequestException('Webhook signature verification failed.');
    }

    this.logger.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          this.logger.log(`PaymentIntent succeeded: ${event.data.object.id}`);
          await this.handleSuccessfulPayment(
            event.data.object,
            event.data.object.id,
          );
          break;
        }

        case 'payment_intent.payment_failed': {
          this.logger.log(`PaymentIntent failed: ${event.data.object.id}`);
          await this.handleFailedPayment(
            event.data.object,
            event.data.object.id,
          );
          break;
        }

        case 'checkout.session.completed': {
          this.logger.log(
            `Checkout session completed: ${event.data.object.id}`,
          );
          const transactionId =
            event.data.object.payment_intent || event.data.object.id;
          await this.handleSuccessfulPayment(event.data.object, transactionId);
          break;
        }

        default:
          this.logger.debug(`Unhandled event type: ${event.type}`);
      }

      this.logger.log(`Successfully processed webhook event: ${event.type}`);
      return { received: true };
    } catch (error: any) {
      this.logger.error(
        `Error processing webhook event ${event.type}: ${error.message}`,
        error.stack,
      );
      // Still return 200 to Stripe to prevent retries for processing errors
      return { received: true };
    }
  }
}
