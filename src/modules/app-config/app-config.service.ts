import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppConfig } from '../../schemas/app-config.schema';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';

@Injectable()
export class AppConfigService {
  constructor(@InjectModel(AppConfig.name) private readonly model: Model<AppConfig>) {}

  async get() {
    // Atomic upsert avoids a duplicate singleton doc if two requests race on first read.
    return this.model.findOneAndUpdate(
      {},
      { $setOnInsert: { general: {}, appSettings: {}, privacyPolicy: {}, termsConditions: {}, appUpdate: {} } },
      { upsert: true, new: true },
    );
  }

  async update(dto: UpdateAppConfigDto) {
    const config = await this.get();
    if (dto.general) Object.assign(config.general, dto.general);
    if (dto.appSettings) Object.assign(config.appSettings, dto.appSettings);
    if (dto.privacyPolicy) Object.assign(config.privacyPolicy, dto.privacyPolicy);
    if (dto.termsConditions) Object.assign(config.termsConditions, dto.termsConditions);
    if (dto.appUpdate) Object.assign(config.appUpdate, dto.appUpdate);
    if (dto.moreAppsLink !== undefined) config.moreAppsLink = dto.moreAppsLink;
    await config.save();
    return config;
  }
}
