import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VerificationService } from './verification.service';
import { RejectVerificationDto, SubmitVerificationDto } from './dto/submit-verification.dto';

@UseGuards(JwtAuthGuard)
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('submit')
  submit(@CurrentUser() user: { userId: string }, @Body() dto: SubmitVerificationDto) {
    return this.verificationService.submit(user.userId, dto);
  }

  @Get('me')
  getMyStatus(@CurrentUser() user: { userId: string }) {
    return this.verificationService.getMyStatus(user.userId);
  }

  @UseGuards(AdminGuard)
  @Get('admin/pending')
  listPending() {
    return this.verificationService.listPending();
  }

  @UseGuards(AdminGuard)
  @Post('admin/:userId/approve')
  approve(@Param('userId') userId: string) {
    return this.verificationService.approve(userId);
  }

  @UseGuards(AdminGuard)
  @Post('admin/:userId/reject')
  reject(@Param('userId') userId: string, @Body() dto: RejectVerificationDto) {
    return this.verificationService.reject(userId, dto.reason);
  }
}
