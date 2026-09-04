import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { SignupCampaignService } from './signup-campaign.service';
import { UpdateSignupCampaignDto } from './dto/update-signup-campaign.dto';

@UseGuards(AdminJwtGuard)
@Controller('signup-campaign')
export class SignupCampaignController {
  constructor(private readonly signupCampaignService: SignupCampaignService) {}

  @Get()
  get() {
    return this.signupCampaignService.get();
  }

  @Patch()
  update(@Body() dto: UpdateSignupCampaignDto) {
    return this.signupCampaignService.update(dto);
  }
}
