import { HttpException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard } from './ws-jwt.guard';

interface AuthedSocket extends Socket {
  data: { user: { userId: string; phoneNumber: string } };
}

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinConversation')
  async joinConversation(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { conversationId: string },
  ) {
    // Only the two participants may join a room — otherwise anyone could
    // listen in on another couple's messages as they arrive.
    try {
      const conversation = await this.chatService.getConversationForParticipant(
        String(data?.conversationId),
        client.data.user.userId,
      );
      const room = conversation._id.toString();
      await client.join(room);
      return { event: 'joinedConversation', conversationId: room };
    } catch (err) {
      throw this.toWsException(err);
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { conversationId: string; text: string },
  ) {
    try {
      const message = await this.chatService.sendMessage(
        String(data?.conversationId),
        client.data.user.userId,
        data?.text,
      );
      this.server.to(message.conversationId.toString()).emit('newMessage', message);
      return { event: 'messageSent', messageId: message.id };
    } catch (err) {
      throw this.toWsException(err);
    }
  }

  private toWsException(err: unknown) {
    if (err instanceof HttpException) {
      const response = err.getResponse();
      const message = typeof response === 'string' ? response : (response as { message?: string }).message;
      return new WsException(message ?? err.message);
    }
    return err;
  }
}
