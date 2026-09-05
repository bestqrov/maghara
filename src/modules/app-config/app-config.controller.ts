import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { AppConfigService } from './app-config.service';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  // Public: the mobile app must be able to check maintenance mode / forced update before a user is even logged in.
  @Get()
  get() {
    return this.appConfigService.get();
  }

  @UseGuards(AdminJwtGuard)
  @Patch()
  update(@Body() dto: UpdateAppConfigDto) {
    return this.appConfigService.update(dto);
  }
}
