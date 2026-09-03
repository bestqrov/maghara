import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSettings, PaymentSettingsSchema } from '../../schemas/payment-settings.schema';
import { PaymentSettingsController } from './payment-settings.controller';
import { PaymentSettingsService } from './payment-settings.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: PaymentSettings.name, schema: PaymentSettingsSchema }])],
  controllers: [PaymentSettingsController],
  providers: [PaymentSettingsService],
})
export class PaymentSettingsModule {}
