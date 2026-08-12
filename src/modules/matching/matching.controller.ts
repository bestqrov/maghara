import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MatchingService } from './matching.service';
import { SearchProfilesDto } from './dto/search-profiles.dto';

@UseGuards(JwtAuthGuard)
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get('search')
  search(@CurrentUser() user: { userId: string }, @Query() dto: SearchProfilesDto) {
    return this.matchingService.search(user.userId, dto);
  }

  @Get('my-matches')
  getMyMatches(@CurrentUser() user: { userId: string }) {
    return this.matchingService.getMyMatches(user.userId);
  }

  @Post('interest/:receiverId')
  sendInterest(
    @CurrentUser() user: { userId: string },
    @Param('receiverId') receiverId: string,
    @Body('isSuperLike') isSuperLike?: boolean,
  ) {
    return this.matchingService.sendInterest(user.userId, receiverId, !!isSuperLike);
  }

  @Post(':matchId/accept')
  accept(@CurrentUser() user: { userId: string }, @Param('matchId') matchId: string) {
    return this.matchingService.respondToMatch(user.userId, matchId, true);
  }

  @Post(':matchId/reject')
  reject(@CurrentUser() user: { userId: string }, @Param('matchId') matchId: string) {
    return this.matchingService.respondToMatch(user.userId, matchId, false);
  }

  @Post(':matchId/engaged')
  markEngaged(@CurrentUser() user: { userId: string }, @Param('matchId') matchId: string) {
    return this.matchingService.markAsEngaged(user.userId, matchId);
  }
}
