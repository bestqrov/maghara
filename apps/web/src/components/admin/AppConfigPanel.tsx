'use client';

import { useEffect, useState } from 'react';
import { AppConfig, getAppConfig, updateAppConfig } from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const EMPTY: AppConfig = {
  general: {},
  appSettings: { maintenanceMode: false, screenshotBlock: false },
  privacyPolicy: {},
  termsConditions: {},
  appUpdate: { enabled: false, requiredVersionCode: 1 },
  builds: {},
  moreAppsLink: '',
};

function withDefaults(data: Partial<AppConfig> | null | undefined): AppConfig {
  return {
    general: { ...EMPTY.general, ...data?.general },
    appSettings: { ...EMPTY.appSettings, ...data?.appSettings },
    privacyPolicy: { ...EMPTY.privacyPolicy, ...data?.privacyPolicy },
    termsConditions: { ...EMPTY.termsConditions, ...data?.termsConditions },
    appUpdate: { ...EMPTY.appUpdate, ...data?.appUpdate },
    builds: { ...EMPTY.builds, ...data?.builds },
    moreAppsLink: data?.moreAppsLink ?? '',
  };
}

export function AppConfigPanel() {
  const { dict } = useAdminDict();
  const [form, setForm] = useState<AppConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setForm(withDefaults(await getAppConfig()));
    } catch {
      setError(dict.appConfig.errorFetch);
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
      setForm(withDefaults(await updateAppConfig(form)));
      setSuccess(true);
    } catch {
      setError(dict.appConfig.errorSave);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">{dict.common.loading}</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.appConfig.generalTitle}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input id="cfgEmail" label={dict.appConfig.emailLabel} value={form.general.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, general: { ...f.general, email: e.target.value } }))} />
          <Input id="cfgAuthor" label={dict.appConfig.authorLabel} value={form.general.author ?? ''} onChange={(e) => setForm((f) => ({ ...f, general: { ...f.general, author: e.target.value } }))} />
          <Input id="cfgContact" label={dict.appConfig.contactLabel} value={form.general.contact ?? ''} onChange={(e) => setForm((f) => ({ ...f, general: { ...f.general, contact: e.target.value } }))} />
          <Input id="cfgWebsite" label={dict.appConfig.websiteLabel} value={form.general.website ?? ''} onChange={(e) => setForm((f) => ({ ...f, general: { ...f.general, website: e.target.value } }))} />
          <Input id="cfgDevelopedBy" label={dict.appConfig.developedByLabel} value={form.general.developedBy ?? ''} onChange={(e) => setForm((f) => ({ ...f, general: { ...f.general, developedBy: e.target.value } }))} />
          <Input id="cfgDescription" label={dict.appConfig.descriptionLabel} value={form.general.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, general: { ...f.general, description: e.target.value } }))} />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.appConfig.settingsTitle}</h3>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={form.appSettings.maintenanceMode}
              onChange={(e) => setForm((f) => ({ ...f, appSettings: { ...f.appSettings, maintenanceMode: e.target.checked } }))}
            />
            {dict.appConfig.maintenanceModeLabel}
          </label>
          <Input
            id="cfgMaintenanceMessage"
            label={dict.appConfig.maintenanceMessageLabel}
            value={form.appSettings.maintenanceMessage ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, appSettings: { ...f.appSettings, maintenanceMessage: e.target.value } }))}
          />
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={form.appSettings.screenshotBlock}
              onChange={(e) => setForm((f) => ({ ...f, appSettings: { ...f.appSettings, screenshotBlock: e.target.checked } }))}
            />
            {dict.appConfig.screenshotBlockLabel}
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.appConfig.privacyPolicyTitle}</h3>
        <div className="mt-4 flex flex-col gap-4">
          <Input id="cfgPrivacyUrl" label={dict.appConfig.urlLabel} value={form.privacyPolicy.url ?? ''} onChange={(e) => setForm((f) => ({ ...f, privacyPolicy: { ...f.privacyPolicy, url: e.target.value } }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-700">{dict.appConfig.contentLabel}</label>
            <textarea
              rows={5}
              className="rounded-xl border border-blue-100 bg-surface px-4 py-3 text-sm text-ink-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              value={form.privacyPolicy.content ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, privacyPolicy: { ...f.privacyPolicy, content: e.target.value } }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.appConfig.termsTitle}</h3>
        <div className="mt-4 flex flex-col gap-4">
          <Input id="cfgTermsUrl" label={dict.appConfig.urlLabel} value={form.termsConditions.url ?? ''} onChange={(e) => setForm((f) => ({ ...f, termsConditions: { ...f.termsConditions, url: e.target.value } }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-700">{dict.appConfig.contentLabel}</label>
            <textarea
              rows={5}
              className="rounded-xl border border-blue-100 bg-surface px-4 py-3 text-sm text-ink-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              value={form.termsConditions.content ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, termsConditions: { ...f.termsConditions, content: e.target.value } }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-blue-900">{dict.appConfig.appUpdateTitle}</h3>
          <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <input
              type="checkbox"
              checked={form.appUpdate.enabled}
              onChange={(e) => setForm((f) => ({ ...f, appUpdate: { ...f.appUpdate, enabled: e.target.checked } }))}
            />
            {dict.appConfig.appUpdateEnabledLabel}
          </label>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="cfgRequiredVersionCode"
            type="number"
            min={1}
            label={dict.appConfig.requiredVersionCodeLabel}
            value={form.appUpdate.requiredVersionCode}
            onChange={(e) => setForm((f) => ({ ...f, appUpdate: { ...f.appUpdate, requiredVersionCode: Number(e.target.value) } }))}
          />
          <Input
            id="cfgAppLink"
            label={dict.appConfig.appLinkLabel}
            value={form.appUpdate.appLink ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, appUpdate: { ...f.appUpdate, appLink: e.target.value } }))}
          />
          <div className="sm:col-span-2">
            <Input
              id="cfgAppUpdateDescription"
              label={dict.appConfig.appUpdateDescriptionLabel}
              value={form.appUpdate.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, appUpdate: { ...f.appUpdate, description: e.target.value } }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.appConfig.buildsTitle}</h3>
        <p className="mt-1 text-xs text-ink-500">{dict.appConfig.buildsSubtitle}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                id="cfgApkUrl"
                label={dict.appConfig.apkUrlLabel}
                value={form.builds.apkUrl ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, builds: { ...f.builds, apkUrl: e.target.value } }))}
              />
            </div>
            {!!form.builds.apkUrl && (
              <a
                href={form.builds.apkUrl}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {dict.appConfig.downloadApk}
              </a>
            )}
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                id="cfgAabUrl"
                label={dict.appConfig.aabUrlLabel}
                value={form.builds.aabUrl ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, builds: { ...f.builds, aabUrl: e.target.value } }))}
              />
            </div>
            {!!form.builds.aabUrl && (
              <a
                href={form.builds.aabUrl}
                target="_blank"
                rel="noreferrer"
                className="whitespace-nowrap rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {dict.appConfig.downloadAab}
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.appConfig.moreAppsTitle}</h3>
        <div className="mt-4">
          <Input
            id="cfgMoreAppsLink"
            label={dict.appConfig.moreAppsLinkLabel}
            value={form.moreAppsLink ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, moreAppsLink: e.target.value }))}
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{dict.appConfig.success}</p>}

      <Button type="submit" loading={saving} className="self-start text-sm">
        {dict.appConfig.save}
      </Button>
    </form>
  );
}
