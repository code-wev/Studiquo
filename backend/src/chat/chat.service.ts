import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatGroup } from '../models/ChatGroup.model';
import { Message } from '../models/Message.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatGroup.name) private chatGroupModel: Model<ChatGroup>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getChatGroupsForUser(userId: string) {
    const id = userId as any;
    return this.chatGroupModel
      .find({
        $or: [{ tutorId: id }, { studentId: id }, { parentIds: id }],
      })
      .lean()
      .exec();
  }

  async getMessages(chatGroupId: string, page = 1, limit = 20) {
    const skip = Math.max(0, page - 1) * limit;
    return this.messageModel
      .find({ chatGroup: chatGroupId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async createMessage(data: {
    chatGroup: string;
    senderId: string;
    content: string;
    type?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) {
    const msg = new this.messageModel({
      chatGroup: data.chatGroup,
      senderId: data.senderId,
      content: data.content,
      type: data.type,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      fileSize: data.fileSize,
    } as any);

    await msg.save();
    return msg.toObject();
  }
}
