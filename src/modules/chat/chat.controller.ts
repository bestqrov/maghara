import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';
import { Message } from '../../schemas/message.schema';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  @Post('conversations/:matchId')
  getOrCreateConversation(@CurrentUser() user: { userId: string }, @Param('matchId') matchId: string) {
    return this.chatService.getOrCreateConversation(matchId, user.userId);
  }

  @Get('conversations/:conversationId/messages')
  getMessages(@Param('conversationId') conversationId: string) {
    return this.messageModel.find({ conversationId }).sort({ createdAt: 1 });
  }

  @Post('conversations/:conversationId/unlock')
  unlockWithCoins(@CurrentUser() user: { userId: string }, @Param('conversationId') conversationId: string) {
    return this.chatService.unlockConversationWithCoins(conversationId, user.userId);
  }
}
