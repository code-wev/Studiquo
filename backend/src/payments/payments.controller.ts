import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { ChatGroup } from 'src/models/ChatGroup.model';
import { Payment } from 'src/models/Payment.model';
import { TimeSlot } from 'src/models/TimeSlot.model'; // You'll need to import this
import { User } from 'src/models/User.model'; // You'll need to import this
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
    @InjectModel(TimeSlot.name) private timeSlotModel: Model<TimeSlot>, // Add this
    @InjectModel(User.name) private userModel: Model<User>, // Add this
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
   * Get booking details including related data
   * @param {string} bookingId - Booking ID
   * @returns {Promise<Object>} Booking with populated data
   */
  private async getBookingWithDetails(bookingId: string): Promise<any> {
    try {
      const booking = await this.bookingModel
        .findById(bookingId)
        .populate({
          path: 'timeSlot',
          model: 'TimeSlot',
          populate: [
            { path: 'tutor', model: 'User' },
            { path: 'student', model: 'User' },
            { path: 'parentIds', model: 'User' },
          ],
        })
        .exec();

      if (!booking) {
        this.logger.error(`Booking ${bookingId} not found`);
        return null;
      }

      this.logger.debug(`Found booking with populated data: ${bookingId}`);
      return booking;
    } catch (error) {
      this.logger.error(
        `Error fetching booking details for ${bookingId}: ${error.message}`,
      );
      return null;
    }
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

    let metadata: Record<string, any> = { bookingId };

    if (bookingId) {
      try {
        const booking = await this.getBookingWithDetails(bookingId);
        if (booking && booking.timeSlot) {
          const timeSlot = booking.timeSlot as any;

          // Prepare metadata with all necessary information
          metadata = {
            bookingId,
            tutorId: timeSlot.tutor?._id?.toString(),
            studentId: timeSlot.student?._id?.toString(),
            subject: booking.subject,
            type: booking.type,
            // Add any other necessary metadata
          };

          this.logger.debug(
            `Found booking ${bookingId} with populated data for PaymentIntent`,
          );
        } else {
          this.logger.warn(
            `Booking ${bookingId} not found or missing timeSlot, but proceeding with PaymentIntent`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Error fetching booking ${bookingId}: ${error.message}`,
        );
      }
    }

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
   * Check if a successful payment exists for a booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise<boolean>} True if successful payment exists
   */
  private async hasSuccessfulPayment(bookingId: string): Promise<boolean> {
    try {
      const successfulPayment = await this.paymentModel.findOne({
        booking: new Types.ObjectId(bookingId),
        status: 'COMPLETED',
      });

      return !!successfulPayment;
    } catch (error) {
      this.logger.error(
        `Error checking payments for booking ${bookingId}: ${error.message}`,
      );
      return false;
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
      this.logger.debug(
        `Attempting to credit tutor ${tutorId} wallet with ${amount}`,
      );

      const wallet = await this.walletModel.findOneAndUpdate(
        { tutorId: new Types.ObjectId(tutorId) },
        {
          $inc: { balance: amount },
          $setOnInsert: {
            currency: 'gbp',
            createdAt: new Date(),
          },
          $set: { updatedAt: new Date() },
          $push: {
            transactions: {
              amount,
              type: 'CREDIT',
              description: 'Payment from booking',
              reference: 'stripe_payment',
              createdAt: new Date(),
            },
          },
        },
        { upsert: true, new: true, runValidators: true },
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
   * @param {string[]} parentIds - Array of parent IDs
   * @param {string} subject - Subject
   * @param {Date} slotEndTime - Slot end time
   * @returns {Promise<void>}
   */
  private async createChatGroup(
    bookingId: string,
    tutorId: string,
    studentId: string,
    parentIds: string[],
    subject: string,
    slotEndTime: Date,
  ): Promise<void> {
    try {
      this.logger.debug(`Creating chat group for booking ${bookingId}`);

      // Check if chat group already exists
      const existingChatGroup = await this.chatGroupModel.findOne({
        booking: new Types.ObjectId(bookingId),
      });

      if (existingChatGroup) {
        this.logger.log(`Chat group already exists for booking: ${bookingId}`);
        return;
      }

      // Create new chat group
      const chatGroup = await this.chatGroupModel.create({
        booking: new Types.ObjectId(bookingId),
        tutorId: new Types.ObjectId(tutorId),
        studentId: new Types.ObjectId(studentId),
        parentIds: parentIds.map((id) => new Types.ObjectId(id)),
        subject,
        startsAt: slotEndTime,
      });

      this.logger.log(
        `Chat group created: ${chatGroup._id} for booking ${bookingId}`,
      );
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
      this.logger.debug(`Sending payment confirmation email to ${parentEmail}`);

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
      // Don't throw error here - email failure shouldn't fail the whole payment process
    }
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
    const bookingId = metadata.bookingId;

    if (!bookingId) {
      this.logger.warn('No bookingId found in successful payment metadata');
      this.logger.debug('Metadata received:', metadata);
      return;
    }

    this.logger.log(`Processing successful payment for booking ${bookingId}`);
    this.logger.debug(
      'Event data received:',
      JSON.stringify(eventData, null, 2),
    );

    try {
      // First, check if payment already exists with this transaction ID
      const existingPayment = await this.paymentModel.findOne({
        transactionId,
        status: 'COMPLETED',
      });

      if (existingPayment) {
        this.logger.warn(
          `Payment with transaction ID ${transactionId} already processed`,
        );
        return;
      }

      // Get booking with populated data
      const booking = await this.getBookingWithDetails(bookingId);
      if (!booking) {
        this.logger.error(`Booking ${bookingId} not found in database`);
        throw new InternalServerErrorException(
          `Booking ${bookingId} not found`,
        );
      }

      // Check if booking is already scheduled
      if (booking.status === 'SCHEDULED') {
        this.logger.warn(`Booking ${bookingId} is already in SCHEDULED status`);

        // Still create payment record if it doesn't exist
        const paymentExists = await this.hasSuccessfulPayment(bookingId);
        if (!paymentExists) {
          const amount =
            eventData.amount_received ||
            eventData.amount ||
            eventData.amount_total ||
            0;
          const currency = eventData.currency || 'eur';
          const amt = Number(amount) || 0;
          const commission = Math.round(amt * 0.2);
          const tutorEarning = Math.max(0, amt - commission);

          await this.paymentModel.create({
            booking: new Types.ObjectId(bookingId),
            amount: amt,
            currency,
            method: 'stripe',
            status: 'COMPLETED',
            transactionId,
            commission,
            tutorEarning,
          });

          this.logger.log(
            `Payment record added for already scheduled booking ${bookingId}`,
          );
        }
        return;
      }

      // Extract payment details
      const amount =
        eventData.amount_received ||
        eventData.amount ||
        eventData.amount_total ||
        0;
      const currency = eventData.currency || 'eur';
      const amt = Number(amount) || 0;

      this.logger.debug(`Payment details: amount=${amt}, currency=${currency}`);

      // Calculate commission and tutor earnings (20% commission)
      const commission = Math.round(amt * 0.2);
      const tutorEarning = Math.max(0, amt - commission);

      this.logger.debug(
        `Calculated commission: ${commission}, tutor earning: ${tutorEarning}`,
      );

      // Get data from populated booking
      const timeSlot = booking.timeSlot as any;
      const tutorId = timeSlot?.tutor?._id?.toString();
      const studentId = timeSlot?.student?._id?.toString();
      const parentIds =
        timeSlot?.parentIds?.map((parent: any) => parent._id.toString()) || [];
      const parentEmail = timeSlot?.student?.email || metadata.parentEmail; // Get email from student or metadata
      const subject = booking.subject;
      const slotEndTime = timeSlot?.endTime || new Date();
      const shortBookingId = booking.bookingId || `BK-${bookingId.slice(-6)}`;

      // Create payment record with all required fields
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

      // Check if there's already a successful payment for this booking
      const hasExistingPayment = await this.hasSuccessfulPayment(bookingId);

      // Update booking status to SCHEDULED only if not already scheduled
      if (booking.status !== 'SCHEDULED' && !hasExistingPayment) {
        const updatedBooking = await this.bookingModel.findByIdAndUpdate(
          bookingId,
          { status: 'SCHEDULED' },
          { new: true },
        );

        this.logger.log(`Booking ${bookingId} status updated to SCHEDULED`);
      } else {
        this.logger.log(
          `Booking ${bookingId} already has a successful payment or is already scheduled`,
        );
      }

      // Credit tutor wallet if tutor exists
      if (tutorId) {
        await this.creditTutorWallet(tutorId, tutorEarning);
      } else {
        this.logger.warn(`No tutor found for booking ${bookingId}`);
      }

      // Create chat group if all required data exists
      if (tutorId && studentId && subject) {
        await this.createChatGroup(
          bookingId,
          tutorId,
          studentId,
          parentIds,
          subject,
          slotEndTime,
        );
      } else {
        this.logger.debug(
          'Skipping chat group creation - missing required fields',
        );
      }

      // Send payment confirmation email if parent email exists
      if (parentEmail) {
        await this.sendPaymentConfirmationEmail(
          parentEmail,
          amt,
          currency,
          shortBookingId,
        );
      } else {
        this.logger.debug('No parent email found for sending confirmation');
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
    const bookingId = metadata.bookingId;

    if (!bookingId) {
      this.logger.warn('No bookingId found in failed payment metadata');
      this.logger.debug('Metadata received:', metadata);
      return;
    }

    this.logger.log(`Processing failed payment for booking ${bookingId}`);

    try {
      // Get booking with populated data
      const booking = await this.getBookingWithDetails(bookingId);
      if (!booking) {
        this.logger.error(`Booking ${bookingId} not found for failed payment`);
        return;
      }

      // Don't update status if booking is already scheduled (has successful payment)
      const hasSuccessfulPayment = await this.hasSuccessfulPayment(bookingId);
      if (hasSuccessfulPayment || booking.status === 'SCHEDULED') {
        this.logger.warn(
          `Booking ${bookingId} already has successful payment, not updating to CANCELLED`,
        );

        // Still create failed payment record for tracking
        const amount = eventData.amount || 0;
        const currency = eventData.currency || 'eur';
        const amt = Number(amount) || 0;

        await this.paymentModel.create({
          booking: new Types.ObjectId(bookingId),
          amount: amt,
          currency,
          method: 'stripe',
          status: 'FAILED',
          transactionId,
          commission: 0,
          tutorEarning: 0,
        });

        return;
      }

      const amount = eventData.amount || 0;
      const currency = eventData.currency || 'eur';
      const amt = Number(amount) || 0;

      // Get data from populated booking for payment record
      const timeSlot = booking.timeSlot as any;
      const tutorId = timeSlot?.tutor?._id?.toString();
      const studentId = timeSlot?.student?._id?.toString();

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

      // Only update booking status to CANCELLED if it's not already scheduled
      if (booking.status !== 'SCHEDULED') {
        await this.bookingModel.findByIdAndUpdate(
          bookingId,
          { status: 'CANCELLED' },
          { new: true },
        );

        this.logger.log(`Booking ${bookingId} status updated to CANCELLED`);
      } else {
        this.logger.log(
          `Booking ${bookingId} is already SCHEDULED, not changing to CANCELLED`,
        );
      }
    } catch (error: any) {
      this.logger.error(
        `Failed to process failed payment for booking ${bookingId}: ${error.message}`,
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
          const paymentIntent = event.data.object;
          this.logger.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
          await this.handleSuccessfulPayment(paymentIntent, paymentIntent.id);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          this.logger.log(`PaymentIntent failed: ${paymentIntent.id}`);
          await this.handleFailedPayment(paymentIntent, paymentIntent.id);
          break;
        }

        case 'checkout.session.completed': {
          const session = event.data.object;
          this.logger.log(`Checkout session completed: ${session.id}`);
          const transactionId = session.payment_intent || session.id;
          await this.handleSuccessfulPayment(session, transactionId);
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
