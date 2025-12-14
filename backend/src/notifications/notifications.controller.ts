import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async getMyNotifications(@Req() req) {
    return this.notificationsService.getMyNotifications(req.user);
  }

  // Internal endpoint for server to send notification (stub)
  @Post()
  async sendNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.sendNotification(dto);
  }
}
