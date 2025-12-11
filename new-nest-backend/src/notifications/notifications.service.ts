import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { getUserSub } from '../common/helpers';
import { Notification } from '../models/notification.model';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
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
    // Internal: send notification to user(s) (stub)
    return { message: 'Notification sent (stub)' };
  }
}
