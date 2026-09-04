import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SignupCampaign, SignupCampaignSchema } from '../../schemas/signup-campaign.schema';
import { SignupCampaignController } from './signup-campaign.controller';
import { SignupCampaignService } from './signup-campaign.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SignupCampaign.name, schema: SignupCampaignSchema }])],
  controllers: [SignupCampaignController],
  providers: [SignupCampaignService],
  exports: [SignupCampaignService],
})
export class SignupCampaignModule {}
