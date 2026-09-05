import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdSettings } from '../../schemas/ad-settings.schema';
import { UpdateAdSettingsDto } from './dto/update-ad-settings.dto';

@Injectable()
export class AdSettingsService {
  constructor(@InjectModel(AdSettings.name) private readonly model: Model<AdSettings>) {}

  async get() {
    // Atomic upsert avoids a duplicate singleton doc if two requests race on first read.
    return this.model.findOneAndUpdate({}, { $setOnInsert: { placements: {} } }, { upsert: true, new: true });
  }

  async update(dto: UpdateAdSettingsDto) {
    const settings = await this.get();
    const { placements, ...rest } = dto;
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined) (settings as unknown as Record<string, unknown>)[key] = value;
    }
    if (placements) Object.assign(settings.placements, placements);
    await settings.save();
    return settings;
  }
}
