import { useEffect } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useAdSettingsStore } from '@/store/adSettings.store';

type Placement = 'bannerHome' | 'bannerMatches' | 'bannerVisitors';

export function BannerAdSlot({ placement }: { placement: Placement }) {
  const { settings, fetched, fetch } = useAdSettingsStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (!fetched || !settings) return null;
  if (!settings.active || !settings.placements[placement] || !settings.admobBannerAdUnitId) return null;

  return (
    <View style={{ alignItems: 'center', marginVertical: 8 }}>
      <BannerAd unitId={settings.admobBannerAdUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}
