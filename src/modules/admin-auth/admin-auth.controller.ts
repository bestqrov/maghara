import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto, ChangeAdminPasswordDto } from './dto/admin-auth.dto';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  // The admin login is a single password with no username, so guessing must be slow.
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 15 * 60 * 1000, limit: 5 } })
  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto.password);
  }

  @UseGuards(AdminJwtGuard, ThrottlerGuard)
  @Throttle({ default: { ttl: 15 * 60 * 1000, limit: 5 } })
  @Post('change-password')
  changePassword(@Body() dto: ChangeAdminPasswordDto) {
    return this.adminAuthService.changePassword(dto.currentPassword, dto.newPassword);
  }
}
