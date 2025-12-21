import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('groups')
  async getGroups(@GetUser() user: any) {
    const userId = user?.userId;
    return this.chatService.getChatGroupsForUser(String(userId));
  }

  @Get(':groupId/messages')
  async getMessages(
    @Param('groupId') groupId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const p = parseInt(String(page), 10) || 1;
    const l = parseInt(String(limit), 10) || 20;
    return this.chatService.getMessages(groupId, p, l);
  }

  @Post(':groupId/message')
  async postMessage(
    @Param('groupId') groupId: string,
    @Body()
    body: {
      content: string;
      type?: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
    },
    @GetUser() user: any,
  ) {
    const userId = user?.userId;
    const msg = await this.chatService.createMessage({
      chatGroup: groupId,
      senderId: userId,
      content: body.content,
      type: body.type,
      fileUrl: body.fileUrl,
      fileName: body.fileName,
      fileSize: body.fileSize,
    });

    // emit to sockets if gateway is up
    try {
      this.chatGateway.server?.to(groupId).emit('newMessage', msg);
    } catch (err) {
      // noop
    }

    return msg;
  }
}
