import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { AdEventType, AppOpenAd } from 'react-native-google-mobile-ads';
import { useAdSettingsStore } from '@/store/adSettings.store';

/** Loads and shows a Google-recommended app-open ad on cold start and whenever the app returns from the background. */
export function useAppOpenAd() {
  const { settings, fetched, fetch } = useAdSettingsStore();
  const adRef = useRef<AppOpenAd | null>(null);
  const shownOnceRef = useRef(false);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!fetched || !settings?.active || !settings.placements.appOpenAd || !settings.admobAppOpenAdUnitId) return;

    const unitId = settings.admobAppOpenAdUnitId;

    function loadAndShow() {
      const ad = AppOpenAd.createForAdRequest(unitId);
      const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => ad.show());
      const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
        adRef.current = null;
      });
      ad.load();
      adRef.current = ad;
      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
      };
    }

    const cleanupInitial = shownOnceRef.current ? undefined : loadAndShow();
    shownOnceRef.current = true;

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && !adRef.current) loadAndShow();
    });

    return () => {
      cleanupInitial?.();
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetched, settings?.active, settings?.admobAppOpenAdUnitId]);
}
