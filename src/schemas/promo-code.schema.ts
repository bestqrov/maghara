import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromoCodeType = 'VIP_DAYS' | 'COINS' | 'CROSS_BORDER_ACCESS';

@Schema({ timestamps: true })
export class PromoCode extends Document {
  @Prop({ required: true, unique: true, uppercase: true, trim: true }) code: string;

  @Prop({ enum: ['VIP_DAYS', 'COINS', 'CROSS_BORDER_ACCESS'], required: true })
  type: PromoCodeType;

  /** Days of VIP for VIP_DAYS, coin amount for COINS. Unused (but kept) for CROSS_BORDER_ACCESS. */
  @Prop({ required: true, min: 0 }) rewardValue: number;

  @Prop({ required: true, min: 1 }) maxRedemptions: number;
  @Prop({ default: 0 }) currentRedemptions: number;

  @Prop({ default: true }) requiresVerification: boolean;
  @Prop() expiresAt?: Date;
  @Prop({ default: true }) isActive: boolean;
}

export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);
