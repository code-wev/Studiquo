import { Model } from 'mongoose';
import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { ChatGroup } from '../models/chatGroup.model';
import { Message } from '../models/message.model';
import { SendMessageDto } from './dto/chat.dto';
export declare class ChatService {
    private chatGroupModel;
    private messageModel;
    constructor(chatGroupModel: Model<ChatGroup>, messageModel: Model<Message>);
    getChatHistory(bookingId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, Message, {}, import("mongoose").DefaultSchemaOptions> & Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    sendMessage(bookingId: MongoIdDto['id'], req: {
        user: any;
    }, dto: SendMessageDto): Promise<import("mongoose").Document<unknown, {}, Message, {}, import("mongoose").DefaultSchemaOptions> & Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
