import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ChatGroup } from '../models/ChatGroup.model';
import { Message } from '../models/Message.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatGroup.name) private chatGroupModel: Model<ChatGroup>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async getChatGroupsForUser(userId: string) {
    if (!userId) return [];

    // normalize possible shapes (token payload or plain id)
    let id: any = userId;
    if (typeof id === 'object' && (id as any).sub) id = (id as any).sub;
    if (typeof id === 'object' && (id as any)._id) id = (id as any)._id;

    const orClauses: any[] = [];
    if (mongoose.isValidObjectId(id)) {
      const objId = new mongoose.Types.ObjectId(String(id));
      orClauses.push(
        { tutorId: objId },
        { studentId: objId },
        { parentIds: { $in: [objId] } },
      );
    } else {
      orClauses.push(
        { tutorId: id },
        { studentId: id },
        { parentIds: { $in: [id] } },
      );
    }

    const chatsGroup = await this.chatGroupModel
      .find({ $or: orClauses })
      .populate({ path: 'tutorId', select: 'firstName lastName avatar' })
      .populate({ path: 'studentId', select: 'firstName lastName avatar' })
      .populate({ path: 'parentIds', select: 'firstName lastName avatar' })
      .lean()
      .exec();

    return chatsGroup;
  }

  async getMessages(chatGroupId: string, page = 1, limit = 20) {
    const skip = Math.max(0, page - 1) * limit;
    const messages = await this.messageModel
      .find({ chatGroup: new mongoose.Types.ObjectId(chatGroupId) })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return messages.reverse();
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
      chatGroup: new mongoose.Types.ObjectId(data.chatGroup),
      senderId: new mongoose.Types.ObjectId(data.senderId),
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
