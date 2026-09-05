import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';

/** Fills the same grid slot as a ProfileCard, so it drops into the 2-column feed without a layout refactor. */
export function NativeAdCard({ unitId }: { unitId: string }) {
  const [nativeAd, setNativeAd] = useState<NativeAd | undefined>();

  useEffect(() => {
    let cancelled = false;
    NativeAd.createForAdRequest(unitId)
      .then((ad) => {
        if (cancelled) ad.destroy();
        else setNativeAd(ad);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [unitId]);

  useEffect(() => {
    return () => nativeAd?.destroy();
  }, [nativeAd]);

  if (!nativeAd) return null;

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.card}>
      <NativeMediaView style={styles.media} />
      <View style={styles.body}>
        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text style={styles.headline} numberOfLines={2}>
            {nativeAd.headline}
          </Text>
        </NativeAsset>
        <View style={styles.ctaRow}>
          {nativeAd.icon && (
            <NativeAsset assetType={NativeAssetType.ICON}>
              <Image source={{ uri: nativeAd.icon.url }} style={styles.icon} />
            </NativeAsset>
          )}
          {nativeAd.callToAction && (
            <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
              <Text style={styles.cta} numberOfLines={1}>
                {nativeAd.callToAction}
              </Text>
            </NativeAsset>
          )}
        </View>
        <Text style={styles.sponsored}>Sponsored</Text>
      </View>
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#ffffff', borderRadius: 22, overflow: 'hidden' },
  media: { width: '100%', aspectRatio: 4 / 5, backgroundColor: '#eef6f0' },
  body: { padding: 12, gap: 6 },
  headline: { fontSize: 14, fontWeight: '700', color: '#0f2e1d' },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 20, height: 20, borderRadius: 4 },
  cta: { flex: 1, fontSize: 12, fontWeight: '700', color: '#24603f' },
  sponsored: { fontSize: 10, color: '#4a5a52' },
});
