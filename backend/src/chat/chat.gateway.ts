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

  private static readonly EVENTS = {
    CONNECTED: 'connected',
    USER_ONLINE: 'userOnline',
    USER_OFFLINE: 'userOffline',
    USER_JOINED: 'userJoined',
    JOINED_ROOM: 'joinedRoom',
    NEW_MESSAGE: 'newMessage',
    MESSAGE_SENT: 'messageSent',
    USER_TYPING: 'userTyping',
    TYPING: 'typing',
    LEFT_ROOM: 'leftRoom',
  } as const;

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
        this.server.emit(ChatGateway.EVENTS.USER_ONLINE, {
          userId,
          sockets: set.size,
        });
        // send full online list to connecting client
        client.emit(ChatGateway.EVENTS.CONNECTED, {
          message: 'Welcome to the chat!',
          userId,
        });
      } else {
        client.emit(ChatGateway.EVENTS.CONNECTED, {
          message: 'Welcome to the chat!',
        });
      }
    } catch (err) {
      client.emit(ChatGateway.EVENTS.CONNECTED, {
        message: 'Welcome to the chat!',
      });
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
            this.server.emit(ChatGateway.EVENTS.USER_OFFLINE, { userId });
          } else {
            this.onlineUsers.set(userId, set);
            this.server.emit(ChatGateway.EVENTS.USER_ONLINE, {
              userId,
              sockets: set.size,
            });
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
    this.server.to(data.room).emit(ChatGateway.EVENTS.USER_JOINED, {
      user: data.user,
    });

    // Acknowledge the room join to the requesting client
    return {
      event: ChatGateway.EVENTS.JOINED_ROOM,
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
    this.server.to(data.room).emit(ChatGateway.EVENTS.NEW_MESSAGE, msg);

    return { event: ChatGateway.EVENTS.MESSAGE_SENT, data: msg };
  }

  /**
   * Handles typing indicator events from clients.
   *
   * Flow:
   * 1. Client emits "typing" with room and typing status
   * 2. Server broadcasts "userTyping" to the room
   * 3. Acknowledgement is sent back to sender
   *
   * @param data - Typing status payload (room, isTyping)
   * @param client - Socket instance of the sender
   * @returns Typing event acknowledgement
   */
  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { room: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const sender = (client as any).data?.user;
    const userId = sender ? String(sender.sub || sender._id) : client.id;
    this.server
      .to(data.room)
      .emit(ChatGateway.EVENTS.USER_TYPING, {
        userId,
        isTyping: !!data.isTyping,
      });
    return {
      event: ChatGateway.EVENTS.TYPING,
      data: { userId, isTyping: !!data.isTyping },
    };
  }

  /**
   * Handles a client's request to leave a chat room.
   *
   * @param data - Room information
   * @param client - Socket instance of the connected client
   * @returns Confirmation event payload
   */
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.room);
    return { event: ChatGateway.EVENTS.LEFT_ROOM, data };
  }
}
