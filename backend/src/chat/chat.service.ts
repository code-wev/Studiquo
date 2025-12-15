import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoIdDto } from 'common/dto/mongoId.dto';
import { Model } from 'mongoose';
import { getUserSub } from '../../common/helpers';
import { ChatGroup } from '../models/chatGroup.model';
import { Message } from '../models/message.model';
import { SendMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatGroup.name) private chatGroupModel: Model<ChatGroup>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getChatHistory(bookingId: MongoIdDto['id']) {
    // Find chat group by bookingId (stub: assumes chatGroup._id === bookingId)
    return this.messageModel
      .find({ chatGroup: bookingId })
      .sort({ createdAt: 1 });
  }

  async sendMessage(
    bookingId: MongoIdDto['id'],
    req: { user: any },
    dto: SendMessageDto,
  ) {
    // Find or create chat group (stub: assumes chatGroup._id === bookingId)
    const message = new this.messageModel({
      chatGroup: bookingId,
      senderId: getUserSub(req),
      content: dto.content,
    });
    await message.save();
    return message;
  }
}
