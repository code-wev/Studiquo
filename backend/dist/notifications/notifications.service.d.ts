import { Model } from 'mongoose';
import { Notification } from '../models/notification.model';
import { CreateNotificationDto } from './dto/notification.dto';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<Notification>);
    getMyNotifications(req: {
        user: any;
    }): Promise<(import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    sendNotification(dto: CreateNotificationDto): Promise<{
        message: string;
        notification: (import("mongoose").Document<unknown, {}, Notification, {}, import("mongoose").DefaultSchemaOptions> & Notification & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
