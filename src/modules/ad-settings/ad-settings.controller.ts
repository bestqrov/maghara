import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { AdSettingsService } from './ad-settings.service';
import { UpdateAdSettingsDto } from './dto/update-ad-settings.dto';

@Controller('ad-settings')
export class AdSettingsController {
  constructor(private readonly adSettingsService: AdSettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  get() {
    return this.adSettingsService.get();
  }

  @UseGuards(AdminJwtGuard)
  @Patch()
  update(@Body() dto: UpdateAdSettingsDto) {
    return this.adSettingsService.update(dto);
  }
}
