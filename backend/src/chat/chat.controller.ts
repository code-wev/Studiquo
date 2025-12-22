import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'common/decorators/roles.decorator';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { PaginationDto } from 'common/dto/pagination.dto';
import { UserRole } from 'src/models/User.model';
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

  /**
   * Get chat groups for the user
   *
   * @param user - the authenticated user
   * @returns list of chat groups
   */
  @Get('groups')
  @Roles(UserRole.Tutor, UserRole.Student, UserRole.Parent)
  async getGroups(@GetUser() user: any) {
    const userId = user?.userId;
    return this.chatService.getChatGroupsForUser(String(userId));
  }

  /**
   * Get messages for a chat group
   *
   * @param groupId - the chat group ID
   * @param page - the page number for pagination
   * @param limit - the number of messages per page
   * @returns list of messages
   */
  @Get(':groupId/messages')
  @Roles(UserRole.Tutor, UserRole.Student, UserRole.Parent)
  async getMessages(
    @Param('groupId') groupId: MongoIdDto['id'],
    @Query() { page, limit }: PaginationDto,
  ) {
    return this.chatService.getMessages(groupId, page, limit);
  }

  /**
   * Post a message to a chat group
   *
   * @param groupId - the chat group ID
   * @param body - the message content and optional file info
   * @param user - the authenticated user
   * @returns the created message
   */
  @Post(':groupId/message')
  @Roles(UserRole.Tutor, UserRole.Student, UserRole.Parent)
  async postMessage(
    @Param('groupId') groupId: MongoIdDto['id'],
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
      // do nothing if gateway is down
    }

    return msg;
  }
}
