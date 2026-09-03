import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto, ChangeAdminPasswordDto } from './dto/admin-auth.dto';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminAuthService.login(dto.password);
  }

  @UseGuards(AdminJwtGuard)
  @Post('change-password')
  changePassword(@Body() dto: ChangeAdminPasswordDto) {
    return this.adminAuthService.changePassword(dto.currentPassword, dto.newPassword);
  }
}
