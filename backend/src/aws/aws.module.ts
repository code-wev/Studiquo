import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';

/**
 * AWS feature module.
 *
 * exposes the `AwsService` for the app.
 */
@Module({
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
