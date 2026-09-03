'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { CreatePromoPayload, PromoCode, PromoCodeType, createPromoCode, listPromoCodes } from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const emptyForm: CreatePromoPayload = {
  code: '',
  type: 'COINS',
  rewardValue: 0,
  maxRedemptions: 1,
  requiresVerification: true,
  isActive: true,
};

export function PromosPanel() {
  const { dict } = useAdminDict();
  const [items, setItems] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreatePromoPayload>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setItems(await listPromoCodes());
    } catch {
      setError(dict.promos.errorFetch);
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
    setCreateError(null);
    setCreating(true);
    try {
      await createPromoCode({
        ...form,
        code: form.code.trim().toUpperCase(),
        expiresAt: form.expiresAt || undefined,
      });
      setForm(emptyForm);
      await refresh();
    } catch (err) {
      const detail =
        isAxiosError(err) && err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String((err.response.data as { message: unknown }).message)
          : dict.promos.errorCreate;
      setCreateError(detail);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="rounded-2xl border border-blue-100 bg-surface p-4 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.promos.createTitle}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            id="promoCode"
            label={dict.promos.codeLabel}
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            required
          />
          <Select
            id="promoType"
            label={dict.promos.typeLabel}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as PromoCodeType }))}
            options={Object.entries(dict.promos.types).map(([value, label]) => ({ value, label }))}
          />
          <Input
            id="promoRewardValue"
            label={dict.promos.rewardValueLabel}
            type="number"
            min={0}
            value={form.rewardValue}
            onChange={(e) => setForm((f) => ({ ...f, rewardValue: Number(e.target.value) }))}
            required
          />
          <Input
            id="promoMaxRedemptions"
            label={dict.promos.maxRedemptionsLabel}
            type="number"
            min={1}
            value={form.maxRedemptions}
            onChange={(e) => setForm((f) => ({ ...f, maxRedemptions: Number(e.target.value) }))}
            required
          />
          <Input
            id="promoExpiresAt"
            label={dict.promos.expiresAtLabel}
            type="date"
            value={form.expiresAt ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
          />
          <div className="flex items-end gap-4 pb-3">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.requiresVerification}
                onChange={(e) => setForm((f) => ({ ...f, requiresVerification: e.target.checked }))}
              />
              {dict.promos.requiresVerificationLabel}
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              {dict.promos.activeLabel}
            </label>
          </div>
        </div>
        {createError && <p className="mt-2 text-sm text-red-500">{createError}</p>}
        <Button type="submit" loading={creating} className="mt-4 text-sm">
          {dict.promos.submit}
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-ink-500">{dict.common.loading}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-surface shadow-sm">
          {error && <p className="p-4 text-sm text-red-500">{error}</p>}
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-blue-100 text-right text-ink-500">
                <th className="px-4 py-3 font-medium">{dict.promos.tableCode}</th>
                <th className="px-4 py-3 font-medium">{dict.promos.tableType}</th>
                <th className="px-4 py-3 font-medium">{dict.promos.tableValue}</th>
                <th className="px-4 py-3 font-medium">{dict.promos.tableUsage}</th>
                <th className="px-4 py-3 font-medium">{dict.promos.tableVerification}</th>
                <th className="px-4 py-3 font-medium">{dict.promos.tableStatus}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-blue-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-blue-900">{item.code}</td>
                  <td className="px-4 py-3">{dict.promos.types[item.type]}</td>
                  <td className="px-4 py-3">{item.rewardValue}</td>
                  <td className="px-4 py-3">
                    {item.currentRedemptions}/{item.maxRedemptions}
                  </td>
                  <td className="px-4 py-3">{item.requiresVerification ? dict.common.yes : dict.common.no}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {item.isActive ? dict.promos.statusActive : dict.promos.statusInactive}
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-ink-500">
                    {dict.promos.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
