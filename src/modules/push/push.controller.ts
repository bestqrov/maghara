import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PushService } from './push.service';
import { SubscribePushDto, UnsubscribePushDto } from './dto/subscribe-push.dto';

@UseGuards(JwtAuthGuard)
@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('subscribe')
  subscribe(@CurrentUser() user: { userId: string }, @Body() dto: SubscribePushDto) {
    return this.pushService.subscribe(user.userId, dto);
  }

  @Post('unsubscribe')
  unsubscribe(@CurrentUser() user: { userId: string }, @Body() dto: UnsubscribePushDto) {
    return this.pushService.unsubscribe(user.userId, dto.endpoint);
  }
}
