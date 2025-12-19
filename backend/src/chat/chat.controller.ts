import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { UserRole } from 'src/models/User.model';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':bookingId/messages')
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async getChatHistory(@Param('bookingId') bookingId: MongoIdDto['id']) {
    return this.chatService.getChatHistory(bookingId);
  }

  @Post(':bookingId/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Student, UserRole.Tutor, UserRole.Parent, UserRole.Admin)
  async sendMessage(
    @Param('bookingId') bookingId: MongoIdDto['id'],
    @Req() req,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(bookingId, req.user, dto);
  }
}
