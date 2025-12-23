import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Application root controller.
 *
 * Provides basic health-check and root endpoints used by the application.
 */
@Controller()
export class AppController {
  /**
   * Creates an instance of `AppController`.
   *
   * @param appService - service that provides application-level helpers
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Simple GET endpoint that returns a greeting string.
   * Used by tests and health checks.
   *
   * @returns a friendly greeting string
   */
  @Get()
  getHello(): { status: string } {
    return this.appService.getHello();
  }
}
