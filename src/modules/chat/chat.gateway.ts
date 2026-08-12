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
    await client.join(data.conversationId);
    return { event: 'joinedConversation', conversationId: data.conversationId };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: AuthedSocket,
    @MessageBody() data: { conversationId: string; text: string },
  ) {
    try {
      const message = await this.chatService.sendMessage(
        data.conversationId,
        client.data.user.userId,
        data.text,
      );
      this.server.to(data.conversationId).emit('newMessage', message);
      return { event: 'messageSent', messageId: message.id };
    } catch (err) {
      if (err instanceof HttpException) {
        const response = err.getResponse();
        const message = typeof response === 'string' ? response : (response as { message?: string }).message;
        throw new WsException(message ?? err.message);
      }
      throw err;
    }
  }
}
