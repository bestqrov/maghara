'use client';

import { useEffect, useState } from 'react';
import { AdSettings, getAdSettings, updateAdSettings } from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const EMPTY: AdSettings = {
  active: false,
  primaryAdNetwork: 'ADMOB',
  admobAppId: '',
  admobPublisherId: '',
  admobBannerAdUnitId: '',
  admobInterstitialAdUnitId: '',
  admobNativeAdUnitId: '',
  admobAppOpenAdUnitId: '',
  interstitialAdInterval: 5,
  nativeAdIndex: 5,
  placements: {
    bannerHome: true,
    bannerMatches: true,
    bannerVisitors: true,
    interstitialFeed: true,
    nativeFeed: true,
    appOpenAd: true,
  },
};

function withDefaults(data: Partial<AdSettings> | null | undefined): AdSettings {
  return {
    ...EMPTY,
    ...data,
    placements: { ...EMPTY.placements, ...data?.placements },
  };
}

export function AdSettingsPanel() {
  const { dict } = useAdminDict();
  const [form, setForm] = useState<AdSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setForm(withDefaults(await getAdSettings()));
    } catch {
      setError(dict.ads.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      setForm(withDefaults(await updateAdSettings(form)));
      setSuccess(true);
    } catch {
      setError(dict.ads.errorSave);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">{dict.common.loading}</p>;

  const placementRows: { key: keyof AdSettings['placements']; label: string }[] = [
    { key: 'bannerHome', label: dict.ads.placementBannerHome },
    { key: 'bannerMatches', label: dict.ads.placementBannerMatches },
    { key: 'bannerVisitors', label: dict.ads.placementBannerVisitors },
    { key: 'interstitialFeed', label: dict.ads.placementInterstitialFeed },
    { key: 'nativeFeed', label: dict.ads.placementNativeFeed },
    { key: 'appOpenAd', label: dict.ads.placementAppOpen },
  ];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.ads.globalTitle}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="interstitialAdInterval"
            label={dict.ads.interstitialIntervalLabel}
            type="number"
            min={1}
            value={form.interstitialAdInterval}
            onChange={(e) => setForm((f) => ({ ...f, interstitialAdInterval: Number(e.target.value) }))}
          />
          <Input
            id="nativeAdIndex"
            label={dict.ads.nativeIndexLabel}
            type="number"
            min={1}
            value={form.nativeAdIndex}
            onChange={(e) => setForm((f) => ({ ...f, nativeAdIndex: Number(e.target.value) }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-blue-900">{dict.ads.manageTitle}</h3>
          <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            {dict.ads.activeLabel}
          </label>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="admobAppId" label={dict.ads.appIdLabel} value={form.admobAppId ?? ''} onChange={(e) => setForm((f) => ({ ...f, admobAppId: e.target.value }))} />
          <Input
            id="admobPublisherId"
            label={dict.ads.publisherIdLabel}
            value={form.admobPublisherId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, admobPublisherId: e.target.value }))}
          />
          <Input
            id="admobBannerAdUnitId"
            label={dict.ads.bannerUnitIdLabel}
            value={form.admobBannerAdUnitId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, admobBannerAdUnitId: e.target.value }))}
          />
          <Input
            id="admobInterstitialAdUnitId"
            label={dict.ads.interstitialUnitIdLabel}
            value={form.admobInterstitialAdUnitId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, admobInterstitialAdUnitId: e.target.value }))}
          />
          <Input
            id="admobNativeAdUnitId"
            label={dict.ads.nativeUnitIdLabel}
            value={form.admobNativeAdUnitId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, admobNativeAdUnitId: e.target.value }))}
          />
          <Input
            id="admobAppOpenAdUnitId"
            label={dict.ads.appOpenUnitIdLabel}
            value={form.admobAppOpenAdUnitId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, admobAppOpenAdUnitId: e.target.value }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.ads.placementTitle}</h3>
        <p className="mt-1 text-xs text-ink-500">{dict.ads.placementSubtitle}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {placementRows.map((row) => (
            <label key={row.key} className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.placements[row.key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, placements: { ...f.placements, [row.key]: e.target.checked } }))
                }
              />
              {row.label}
            </label>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{dict.ads.success}</p>}

      <Button type="submit" loading={saving} className="self-start text-sm">
        {dict.ads.save}
      </Button>
    </form>
  );
}
