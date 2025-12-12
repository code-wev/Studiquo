import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from '../models/notification.model';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { jwtConfig } from 'src/common/jwt.config';
import { MailModule } from 'src/common/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    JwtModule.register(jwtConfig),
    MailModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
