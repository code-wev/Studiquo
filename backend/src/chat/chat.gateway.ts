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

/**
 * ChatGateway
 *
 * WebSocket gateway responsible for real-time chat communication.
 * Handles:
 * - Client connections and disconnections
 * - Room join/leave events
 * - Sending and broadcasting chat messages
 *
 * Uses Socket.IO under the hood and integrates with ChatService
 * for persistence and business logic.
 */
@WebSocketGateway({
  cors: {
    // Allow frontend application to connect via WebSocket
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  /**
   * Socket.IO server instance
   * Used to emit events to connected clients
   */
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  /**
   * Triggered automatically when a client connects to the WebSocket server.
   *
   * @param client - Connected socket instance
   */
  handleConnection(client: Socket): void {
    // Send a welcome message to the newly connected client
    client.emit('connected', {
      message: 'Welcome to the chat!',
    });
  }

  /**
   * Triggered automatically when a client disconnects.
   *
   * @param client - Disconnected socket instance
   */
  handleDisconnect(client: Socket): void {
    // Notify all connected clients that a user has left
    this.server.emit('userLeft', {
      userId: client.id,
    });
  }

  /**
   * Handles a client's request to join a chat room.
   *
   * Events:
   * - Client emits: "joinRoom"
   * - Server emits to room: "userJoined"
   * - Server responds to client: "joinedRoom"
   *
   * @param data - Room and user information
   * @param client - Socket instance of the connected client
   * @returns Confirmation event payload
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { room: string; user: string },
    @ConnectedSocket() client: Socket,
  ): { event: string; data: any } {
    // Add the client socket to the specified room
    client.join(data.room);

    // Notify other users in the room
    this.server.to(data.room).emit('userJoined', {
      user: data.user,
    });

    // Acknowledge the room join to the requesting client
    return {
      event: 'joinedRoom',
      data,
    };
  }

  /**
   * Handles incoming chat messages from clients.
   *
   * Flow:
   * 1. Client emits "sendMessage"
   * 2. Message is saved via ChatService
   * 3. Message is broadcast to all users in the room
   * 4. Acknowledgement is sent back to sender
   *
   * @param data - Message payload (room, user, message text)
   * @param client - Socket instance of the sender
   * @returns Message sent acknowledgement
   */
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: { room: string; user: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<{ event: string; data: any }> {
    /**
     * Construct DTO and request object to reuse
     * existing ChatService logic (HTTP-like context)
     */
    const dto = { content: data.message };
    const req = { user: { sub: data.user } };

    // Persist the message using the chat service
    await this.chatService.sendMessage(data.room, req, dto);

    // Broadcast the message to all clients in the room
    this.server.to(data.room).emit('newMessage', data);

    // Send acknowledgement back to the sender
    return {
      event: 'messageSent',
      data,
    };
  }
}
