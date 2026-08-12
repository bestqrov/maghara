import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VisitorsService } from './visitors.service';

@UseGuards(JwtAuthGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post('visit/:profileId')
  recordVisit(@CurrentUser() user: { userId: string }, @Param('profileId') profileId: string) {
    return this.visitorsService.recordVisit(user.userId, profileId);
  }

  @Get('me')
  getMyVisitors(@CurrentUser() user: { userId: string }) {
    return this.visitorsService.getMyVisitors(user.userId);
  }
}
