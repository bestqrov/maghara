import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/** Singleton document: when active and "now" falls in [startsAt, endsAt), every new registration gets vipDays of free VIP automatically. */
@Schema({ timestamps: true })
export class SignupCampaign extends Document {
  @Prop({ default: false }) active: boolean;
  @Prop() startsAt?: Date;
  @Prop() endsAt?: Date;
  @Prop({ default: 15, min: 1 }) vipDays: number;
}

export const SignupCampaignSchema = SchemaFactory.createForClass(SignupCampaign);
