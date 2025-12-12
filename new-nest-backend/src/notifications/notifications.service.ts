import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { getUserSub } from '../common/helpers';
import { Notification } from '../models/notification.model';
import { CreateNotificationDto } from './dto/notification.dto';
import { MailService } from 'src/common/mail.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private mailService?: MailService,
  ) {
    // Example: send email notifications every hour (stub)
    cron.schedule('0 * * * *', () => {
      // Mailing logic stub
      // console.log('Send scheduled email notifications');
    });
  }

  async getMyNotifications(req: { user: any }) {
    return this.notificationModel.find({ user: getUserSub(req) });
  }

  async sendNotification(dto: CreateNotificationDto) {
    // Persist notification
    const saved = await this.notificationModel.create(dto as any);

    // If an email is present, enqueue it
    if ((dto as any).email && this.mailService) {
      const mailOptions = {
        from: process.env.MAIL_FROM || 'no-reply@example.com',
        to: (dto as any).email,
        subject: (dto as any).title || 'Notification',
        text: (dto as any).message,
        html: `<p>${(dto as any).message}</p>`,
      };
      await this.mailService.enqueue(mailOptions);
    }

    return { message: 'Notification saved and queued', notification: saved };
  }
}
