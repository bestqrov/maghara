import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class CryptoWallets {
  @Prop() trc20?: string;
  @Prop() polygon?: string;
  @Prop() solana?: string;
}
export const CryptoWalletsSchema = SchemaFactory.createForClass(CryptoWallets);

@Schema({ _id: false })
export class BankTransferDetails {
  @Prop() bankName?: string;
  @Prop() accountHolder?: string;
  @Prop() rib?: string;
}
export const BankTransferDetailsSchema = SchemaFactory.createForClass(BankTransferDetails);

@Schema({ _id: false })
export class CashPlusDetails {
  @Prop() code?: string;
}
export const CashPlusDetailsSchema = SchemaFactory.createForClass(CashPlusDetails);

@Schema({ _id: false })
export class InternationalWireDetails {
  @Prop() bankName?: string;
  @Prop() accountHolder?: string;
  @Prop() iban?: string;
  @Prop() swiftBic?: string;
  @Prop() bankAddress?: string;
}
export const InternationalWireDetailsSchema = SchemaFactory.createForClass(InternationalWireDetails);

/** Singleton document holding the real destination accounts shown to users paying for coins/VIP/verification. */
@Schema({ timestamps: true })
export class PaymentSettings extends Document {
  @Prop({ type: CryptoWalletsSchema, default: {} }) cryptoWallets: CryptoWallets;
  @Prop({ type: BankTransferDetailsSchema, default: {} }) bankTransfer: BankTransferDetails;
  @Prop({ type: CashPlusDetailsSchema, default: {} }) cashPlus: CashPlusDetails;
  @Prop({ type: InternationalWireDetailsSchema, default: {} }) internationalWire: InternationalWireDetails;
}

export const PaymentSettingsSchema = SchemaFactory.createForClass(PaymentSettings);
