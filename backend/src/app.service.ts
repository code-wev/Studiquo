import { Injectable } from '@nestjs/common';

/**
 * Application-level service with small helpers used across the app.
 *
 * Keep this service lightweight — it is primarily used by the root
 * controller and unit tests.
 */
@Injectable()
export class AppService {
  /**
   * Return a simple greeting string.
   * Used by the root GET endpoint and tests.
   *
   * @returns greeting message
   */
  getHello(): { status: string } {
    return { status: 'ok' };
  }
}
