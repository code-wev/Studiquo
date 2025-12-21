import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    credentials: true,
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

  private onlineUsers = new Map<string, Set<string>>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Triggered automatically when a client connects to the WebSocket server.
   *
   * @param client - Connected socket instance
   */
  handleConnection(client: Socket): void {
    // Attempt to identify the user from the token provided during handshake
    try {
      const token =
        (client.handshake && (client.handshake.auth as any)?.token) ||
        (client.handshake && (client.handshake.query as any)?.token);

      if (token) {
        const payload = this.jwtService.verify(token as string);
        // store user info on socket for later use
        (client as any).data = (client as any).data || {};
        (client as any).data.user = payload;

        const userId = String(payload.sub || payload._id);

        const set = this.onlineUsers.get(userId) || new Set<string>();
        set.add(client.id);
        this.onlineUsers.set(userId, set);

        // broadcast user's online status
        this.server.emit('userOnline', { userId, sockets: set.size });
        // send full online list to connecting client
        client.emit('connected', { message: 'Welcome to the chat!', userId });
      } else {
        client.emit('connected', { message: 'Welcome to the chat!' });
      }
    } catch (err) {
      client.emit('connected', { message: 'Welcome to the chat!' });
    }
  }

  /**
   * Triggered automatically when a client disconnects.
   *
   * @param client - Disconnected socket instance
   */
  handleDisconnect(client: Socket): void {
    // If socket was associated with a user, remove it from online map
    try {
      const user = (client as any).data?.user;
      if (user) {
        const userId = String(user.sub || user._id);
        const set = this.onlineUsers.get(userId);
        if (set) {
          set.delete(client.id);
          if (set.size === 0) {
            this.onlineUsers.delete(userId);
            this.server.emit('userOffline', { userId });
          } else {
            this.onlineUsers.set(userId, set);
            this.server.emit('userOnline', { userId, sockets: set.size });
          }
        }
      }
    } catch (err) {
      // best-effort only
    }
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
  ) {
    const sender = (client as any).data?.user;
    const senderId = sender ? String(sender.sub || sender._id) : data.user;

    // persist message
    const msg = await this.chatService.createMessage({
      chatGroup: data.room,
      senderId,
      content: data.message,
    });

    // broadcast to room
    this.server.to(data.room).emit('newMessage', msg);

    return { event: 'messageSent', data: msg };
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { room: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const sender = (client as any).data?.user;
    const userId = sender ? String(sender.sub || sender._id) : client.id;
    this.server
      .to(data.room)
      .emit('userTyping', { userId, isTyping: !!data.isTyping });
    return { event: 'typing', data: { userId, isTyping: !!data.isTyping } };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    return { event: 'leftRoom', data };
  }
}
