'use client';

import { useEffect, useState } from 'react';
import { SignupCampaign, getSignupCampaign, updateSignupCampaign } from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const EMPTY: SignupCampaign = { active: false, startsAt: '', endsAt: '', vipDays: 15 };

/** yyyy-MM-ddThh:mm for a <input type="datetime-local">, in the browser's local time. */
function toLocalInputValue(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SignupCampaignPanel() {
  const { dict } = useAdminDict();
  const [form, setForm] = useState<SignupCampaign>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSignupCampaign();
      setForm({
        active: data.active,
        startsAt: toLocalInputValue(data.startsAt),
        endsAt: toLocalInputValue(data.endsAt),
        vipDays: data.vipDays ?? 15,
      });
    } catch {
      setError(dict.signupCampaign.errorFetch);
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
      const updated = await updateSignupCampaign({
        active: form.active,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
        vipDays: Number(form.vipDays),
      });
      setForm({
        active: updated.active,
        startsAt: toLocalInputValue(updated.startsAt),
        endsAt: toLocalInputValue(updated.endsAt),
        vipDays: updated.vipDays,
      });
      setSuccess(true);
    } catch {
      setError(dict.signupCampaign.errorSave);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">{dict.common.loading}</p>;

  const now = new Date();
  const starts = form.startsAt ? new Date(form.startsAt) : null;
  const ends = form.endsAt ? new Date(form.endsAt) : null;
  let status = dict.signupCampaign.statusOff;
  if (form.active) {
    if (starts && now < starts) status = dict.signupCampaign.statusScheduled;
    else if (ends && now >= ends) status = dict.signupCampaign.statusEnded;
    else status = dict.signupCampaign.statusRunning;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-ink-500">{dict.signupCampaign.intro}</p>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-blue-900">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
            />
            {dict.signupCampaign.activeLabel}
          </label>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{status}</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="campaignStartsAt"
            label={dict.signupCampaign.startsAtLabel}
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
          />
          <Input
            id="campaignEndsAt"
            label={dict.signupCampaign.endsAtLabel}
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
          />
          <Input
            id="campaignVipDays"
            label={dict.signupCampaign.vipDaysLabel}
            type="number"
            min={1}
            value={form.vipDays}
            onChange={(e) => setForm((f) => ({ ...f, vipDays: Number(e.target.value) }))}
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{dict.signupCampaign.success}</p>}

      <Button type="submit" loading={saving} className="self-start text-sm">
        {dict.signupCampaign.save}
      </Button>
    </form>
  );
}
