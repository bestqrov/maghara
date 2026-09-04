import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupCampaign } from '../../schemas/signup-campaign.schema';
import { UpdateSignupCampaignDto } from './dto/update-signup-campaign.dto';

@Injectable()
export class SignupCampaignService {
  constructor(@InjectModel(SignupCampaign.name) private readonly model: Model<SignupCampaign>) {}

  async get() {
    // Atomic upsert avoids a duplicate singleton doc if two requests race on first read.
    return this.model.findOneAndUpdate({}, { $setOnInsert: { active: false, vipDays: 15 } }, { upsert: true, new: true });
  }

  async update(dto: UpdateSignupCampaignDto) {
    const campaign = await this.get();
    if (dto.active !== undefined) campaign.active = dto.active;
    if (dto.startsAt !== undefined) campaign.startsAt = new Date(dto.startsAt);
    if (dto.endsAt !== undefined) campaign.endsAt = new Date(dto.endsAt);
    if (dto.vipDays !== undefined) campaign.vipDays = dto.vipDays;
    await campaign.save();
    return campaign;
  }

  /** Returns the VIP days to grant a user registering right now, or null if no campaign currently applies. */
  async getActiveVipDays(): Promise<number | null> {
    const campaign = await this.model.findOne();
    if (!campaign || !campaign.active) return null;

    const now = new Date();
    if (campaign.startsAt && now < campaign.startsAt) return null;
    if (campaign.endsAt && now >= campaign.endsAt) return null;

    return campaign.vipDays;
  }
}
