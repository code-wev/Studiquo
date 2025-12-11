import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role, Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':bookingId/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async getChatHistory(@Param('bookingId') bookingId: string) {
    return this.chatService.getChatHistory(bookingId);
  }

  @Post(':bookingId/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Student, Role.Tutor, Role.Parent, Role.Admin)
  async sendMessage(
    @Param('bookingId') bookingId: string,
    @Req() req,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(bookingId, req.user, dto);
  }
}
