import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentSettings } from '../../schemas/payment-settings.schema';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';

@Injectable()
export class PaymentSettingsService {
  constructor(@InjectModel(PaymentSettings.name) private readonly model: Model<PaymentSettings>) {}

  async get() {
    // Atomic upsert avoids a duplicate singleton doc if two requests race on first read.
    return this.model.findOneAndUpdate(
      {},
      { $setOnInsert: { cryptoWallets: {}, bankTransfer: {}, cashPlus: {}, internationalWire: {} } },
      { upsert: true, new: true },
    );
  }

  async update(dto: UpdatePaymentSettingsDto) {
    const settings = await this.get();
    if (dto.cryptoWallets) Object.assign(settings.cryptoWallets, dto.cryptoWallets);
    if (dto.bankTransfer) Object.assign(settings.bankTransfer, dto.bankTransfer);
    if (dto.cashPlus) Object.assign(settings.cashPlus, dto.cashPlus);
    if (dto.internationalWire) Object.assign(settings.internationalWire, dto.internationalWire);
    await settings.save();
    return settings;
  }
}
