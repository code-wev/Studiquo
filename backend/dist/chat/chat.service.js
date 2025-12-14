"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const helpers_1 = require("../common/helpers");
const chatGroup_model_1 = require("../models/chatGroup.model");
const message_model_1 = require("../models/message.model");
let ChatService = class ChatService {
    chatGroupModel;
    messageModel;
    constructor(chatGroupModel, messageModel) {
        this.chatGroupModel = chatGroupModel;
        this.messageModel = messageModel;
    }
    async getChatHistory(bookingId) {
        return this.messageModel
            .find({ chatGroup: bookingId })
            .sort({ createdAt: 1 });
    }
    async sendMessage(bookingId, req, dto) {
        const message = new this.messageModel({
            chatGroup: bookingId,
            senderId: (0, helpers_1.getUserSub)(req),
            content: dto.content,
        });
        await message.save();
        return message;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chatGroup_model_1.ChatGroup.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_model_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map