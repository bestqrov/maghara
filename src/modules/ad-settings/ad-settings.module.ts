import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdSettings, AdSettingsSchema } from '../../schemas/ad-settings.schema';
import { AdSettingsController } from './ad-settings.controller';
import { AdSettingsService } from './ad-settings.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: AdSettings.name, schema: AdSettingsSchema }])],
  controllers: [AdSettingsController],
  providers: [AdSettingsService],
})
export class AdSettingsModule {}
