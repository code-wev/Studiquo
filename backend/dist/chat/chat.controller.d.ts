import { MongoIdDto } from 'src/common/dto/mongoId.dto';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getChatHistory(bookingId: MongoIdDto['id']): Promise<(import("mongoose").Document<unknown, {}, import("../models/message.model").Message, {}, import("mongoose").DefaultSchemaOptions> & import("../models/message.model").Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    sendMessage(bookingId: MongoIdDto['id'], req: any, dto: SendMessageDto): Promise<import("mongoose").Document<unknown, {}, import("../models/message.model").Message, {}, import("mongoose").DefaultSchemaOptions> & import("../models/message.model").Message & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
