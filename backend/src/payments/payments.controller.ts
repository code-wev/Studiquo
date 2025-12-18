import { Body, Controller, Logger, Post } from '@nestjs/common';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  /**
   * Mock Stripe webhook endpoint.
   * For now, just logs the received event.
   */
  @Post('webhook')
  async handleWebhook(@Body() event: any) {
    this.logger.log('Received webhook event:', event);
    // TODO: Process the webhook event
    return { received: true };
  }
}
