import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class AdPlacements {
  @Prop({ default: true }) bannerHome: boolean;
  @Prop({ default: true }) bannerMatches: boolean;
  @Prop({ default: true }) bannerVisitors: boolean;
  @Prop({ default: true }) interstitialFeed: boolean;
  @Prop({ default: true }) nativeFeed: boolean;
  @Prop({ default: true }) appOpenAd: boolean;
}
export const AdPlacementsSchema = SchemaFactory.createForClass(AdPlacements);

/** Singleton document: AdMob configuration the mobile app fetches to decide what ads to show and where. */
@Schema({ timestamps: true })
export class AdSettings extends Document {
  @Prop({ default: false }) active: boolean;
  @Prop({ default: 'ADMOB' }) primaryAdNetwork: string;

  @Prop() admobAppId?: string;
  @Prop() admobPublisherId?: string;
  @Prop() admobBannerAdUnitId?: string;
  @Prop() admobInterstitialAdUnitId?: string;
  @Prop() admobNativeAdUnitId?: string;
  @Prop() admobAppOpenAdUnitId?: string;

  /** Show an interstitial after every N profile views/interests in the feed. */
  @Prop({ default: 5, min: 1 }) interstitialAdInterval: number;
  /** Insert a native ad into the feed/search results every N profiles. */
  @Prop({ default: 5, min: 1 }) nativeAdIndex: number;

  @Prop({ type: AdPlacementsSchema, default: {} }) placements: AdPlacements;
}

export const AdSettingsSchema = SchemaFactory.createForClass(AdSettings);
