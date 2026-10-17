import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations/:matchId')
  getOrCreateConversation(@CurrentUser() user: { userId: string }, @Param('matchId') matchId: string) {
    return this.chatService.getOrCreateConversation(matchId, user.userId);
  }

  @Get('conversations/:conversationId/messages')
  getMessages(@CurrentUser() user: { userId: string }, @Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId, user.userId);
  }

  @Post('conversations/:conversationId/unlock')
  unlockWithCoins(@CurrentUser() user: { userId: string }, @Param('conversationId') conversationId: string) {
    return this.chatService.unlockConversationWithCoins(conversationId, user.userId);
  }
}
