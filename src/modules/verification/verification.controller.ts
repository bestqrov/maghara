import { BadRequestException, Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DocumentKind, VerificationService } from './verification.service';
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

  @UseGuards(AdminJwtGuard)
  @Get('admin/pending')
  listPending() {
    return this.verificationService.listPending();
  }

  @UseGuards(AdminJwtGuard)
  @Get('admin/:userId/documents/:kind')
  async getDocument(@Param('userId') userId: string, @Param('kind') kind: string, @Res() res: Response) {
    if (kind !== 'id' && kind !== 'residency' && kind !== 'selfie') throw new BadRequestException('Unknown document kind');
    const { contentType, body } = await this.verificationService.getDocument(userId, kind as DocumentKind);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, no-store');
    res.send(body);
  }

  @UseGuards(AdminJwtGuard)
  @Post('admin/:userId/approve')
  approve(@Param('userId') userId: string) {
    return this.verificationService.approve(userId);
  }

  @UseGuards(AdminJwtGuard)
  @Post('admin/:userId/reject')
  reject(@Param('userId') userId: string, @Body() dto: RejectVerificationDto) {
    return this.verificationService.reject(userId, dto.reason);
  }
}

