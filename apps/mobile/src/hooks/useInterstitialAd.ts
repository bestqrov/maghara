import { useCallback, useEffect, useRef } from 'react';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { useAdSettingsStore } from '@/store/adSettings.store';

/**
 * Call `notifyAction()` after each unit of activity (e.g. a profile viewed). Every
 * `interstitialAdInterval` calls, a preloaded interstitial is shown and the next one
 * starts loading immediately so there's rarely a wait.
 */
export function useInterstitialAd() {
  const { settings, fetched, fetch } = useAdSettingsStore();
  const adRef = useRef<InterstitialAd | null>(null);
  const loadedRef = useRef(false);
  const counterRef = useRef(0);

  const loadAd = useCallback((unitId: string) => {
    const ad = InterstitialAd.createForAdRequest(unitId);
    loadedRef.current = false;
    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });
    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadAd(unitId);
    });
    ad.load();
    adRef.current = ad;
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!fetched || !settings?.active || !settings.placements.interstitialFeed || !settings.admobInterstitialAdUnitId) {
      return;
    }
    return loadAd(settings.admobInterstitialAdUnitId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, settings?.active, settings?.admobInterstitialAdUnitId]);

  const notifyAction = useCallback(() => {
    if (!settings?.active || !settings.placements.interstitialFeed) return;
    counterRef.current += 1;
    if (counterRef.current < settings.interstitialAdInterval) return;
    counterRef.current = 0;
    if (loadedRef.current && adRef.current) {
      adRef.current.show();
      loadedRef.current = false;
    }
  }, [settings]);

  return { notifyAction };
}
