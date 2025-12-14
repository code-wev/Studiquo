import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(data: {
        room: string;
        user: string;
    }, client: Socket): {
        event: string;
        data: any;
    };
    handleMessage(data: {
        room: string;
        user: string;
        message: string;
    }, client: Socket): Promise<{
        event: string;
        data: any;
    }>;
}
