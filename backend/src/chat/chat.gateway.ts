import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket): void {
    (client as any).emit('connected', { message: 'Welcome to the chat!' });
  }

  handleDisconnect(client: Socket): void {
    (this.server as any).emit('userLeft', { userId: (client as any).id });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { room: string; user: string },
    @ConnectedSocket() client: Socket,
  ): { event: string; data: any } {
    (client as any).join(data.room);
    (this.server as any).to(data.room).emit('userJoined', { user: data.user });
    return { event: 'joinedRoom', data };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { room: string; user: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<{ event: string; data: any }> {
    const dto = { content: data.message };
    const req = { user: { sub: data.user } };
    await this.chatService.sendMessage(data.room, req, dto);
    (this.server as any).to(data.room).emit('newMessage', data);
    return { event: 'messageSent', data };
  }
}
