import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConfig } from '../../common/jwt.config';
import { ChatGroup, ChatGroupSchema } from '../models/ChatGroup.model';
import { Message, MessageSchema } from '../models/Message.model';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

/**
 * Chat feature module.
 *
 * Registers the `ChatGroup` and `Message` schemas and
 * exposes the `ChatService` and `ChatController` for the app.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatGroup.name, schema: ChatGroupSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
