import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model").Notification & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    sendNotification(dto: CreateNotificationDto): Promise<{
        message: string;
        notification: (import("mongoose").Document<unknown, {}, import("../models/notification.model").Notification, {}, import("mongoose").DefaultSchemaOptions> & import("../models/notification.model").Notification & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
