import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PromosService } from './promos.service';
import { RedeemPromoDto } from './dto/redeem-promo.dto';
import { CreatePromoDto } from './dto/create-promo.dto';

@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('redeem')
  redeem(@CurrentUser() user: { userId: string }, @Body() dto: RedeemPromoDto) {
    return this.promosService.redeem(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('referral')
  getReferralInfo(@CurrentUser() user: { userId: string }) {
    return this.promosService.getReferralInfo(user.userId);
  }

  @UseGuards(AdminJwtGuard)
  @Post('admin/create')
  create(@Body() dto: CreatePromoDto) {
    return this.promosService.create(dto);
  }

  @UseGuards(AdminJwtGuard)
  @Get('admin/list')
  list() {
    return this.promosService.list();
  }

  @UseGuards(AdminJwtGuard)
  @Get('admin/referrals')
  listReferrals() {
    return this.promosService.adminListReferrals();
  }
}
