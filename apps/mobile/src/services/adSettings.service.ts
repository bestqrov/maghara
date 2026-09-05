import { api } from './api';

export interface AdSettings {
  active: boolean;
  admobBannerAdUnitId?: string;
  admobInterstitialAdUnitId?: string;
  admobNativeAdUnitId?: string;
  admobAppOpenAdUnitId?: string;
  interstitialAdInterval: number;
  nativeAdIndex: number;
  placements: {
    bannerHome: boolean;
    bannerMatches: boolean;
    bannerVisitors: boolean;
    interstitialFeed: boolean;
    nativeFeed: boolean;
    appOpenAd: boolean;
  };
}

export async function getAdSettings() {
  const { data } = await api.get<AdSettings>('/ad-settings');
  return data;
}
