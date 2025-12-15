import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getUserSub } from '../../common/helpers';
import { Notification } from '../models/notification.model';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async getMyNotifications(req: { user: any }) {
    return this.notificationModel.find({ user: getUserSub(req) });
  }

  async sendNotification(dto: CreateNotificationDto) {
    // Persist notification
    const saved = await this.notificationModel.create(dto as any);

    // If send email and socket notification logic were implemented, they would go here

    return { message: 'Notification saved and queued', notification: saved };
  }
}
