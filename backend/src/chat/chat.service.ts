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

  /**
   * Get chat groups for a user
   *
   * @param userId - the user ID
   * @returns list of chat groups
   */
  async getChatGroupsForUser(userId: string) {
    if (!userId) return [];

    // normalize user id
    let id: any = userId;
    if (typeof id === 'object' && id?.sub) id = id.sub;
    if (typeof id === 'object' && id?._id) id = id._id;

    const objId = mongoose.isValidObjectId(id)
      ? new mongoose.Types.ObjectId(String(id))
      : id;

    const chatsGroup = await this.chatGroupModel.aggregate([
      {
        $match: {
          $or: [
            { tutorId: objId },
            { studentId: objId },
            { parentIds: { $in: [objId] } },
          ],
          // Chat can start after this time in this group
          // startsAt: { $gte: new Date() },
        },
      },

      /* ---------- tutor ---------- */
      {
        $lookup: {
          from: 'users',
          localField: 'tutorId',
          foreignField: '_id',
          as: 'tutor',
        },
      },
      {
        $unwind: {
          path: '$tutor',
          preserveNullAndEmptyArrays: true,
        },
      },

      /* ---------- student ---------- */
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student',
        },
      },
      {
        $unwind: {
          path: '$student',
          preserveNullAndEmptyArrays: true,
        },
      },

      /* ---------- parents ---------- */
      {
        $lookup: {
          from: 'users',
          localField: 'parentIds',
          foreignField: '_id',
          as: 'parents',
        },
      },

      /* ---------- cleanup ---------- */
      {
        $project: {
          tutorId: 0,
          studentId: 0,
          parentIds: 0,

          'tutor.password': 0,
          'student.password': 0,
          'parents.password': 0,

          __v: 0,
        },
      },
    ]);

    return chatsGroup;
  }

  /**
   * Get messages for a chat group with pagination
   *
   * @param chatGroupId - the chat group ID
   * @param page - the page number (default: 1)
   * @param limit - number of messages per page (default: 20)
   * @returns list of messages
   */
  async getMessages(chatGroupId: string, page = 1, limit = 20) {
    const skip = Math.max(0, page - 1) * limit;

    // First check if chat group exists and has started
    const chatGroup = await this.chatGroupModel.findOne({
      _id: new mongoose.Types.ObjectId(chatGroupId),
      // startsAt: { $lte: new Date() },
    });

    if (!chatGroup) {
      throw new Error('Chat group not found or chat has not started yet');
    }

    const messages = await this.messageModel.aggregate([
      {
        $match: {
          chatGroup: new mongoose.Types.ObjectId(chatGroupId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'sender',
        },
      },
      {
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          senderId: 0,
          'sender.password': 0,
          'sender.__v': 0,
        },
      },
    ]);

    // reverse to keep oldest → newest in UI
    return messages.reverse();
  }

  /**
   * Create a new message in a chat group
   *
   * @param data - message data
   * @returns the created message
   */
  async createMessage(data: {
    chatGroup: string;
    senderId: string;
    content: string;
    type?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }) {
    const chatGroup = await this.chatGroupModel.findOne({
      _id: new mongoose.Types.ObjectId(data.chatGroup),
      // startsAt: { $lte: new Date() },
    });

    if (!chatGroup) {
      throw new Error('Chat group not found or chat has not started yet');
    }

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
