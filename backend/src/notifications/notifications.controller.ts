import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/models/user.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateNotificationDto } from './dto/notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async getMyNotifications(@Req() req) {
    return this.notificationsService.getMyNotifications(req.user);
  }

  // Internal endpoint for server to send notification (stub)
  @Post()
  async sendNotification(@Body() dto: CreateNotificationDto) {
    return this.notificationsService.sendNotification(dto);
  }
}
