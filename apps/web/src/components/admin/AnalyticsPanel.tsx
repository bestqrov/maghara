'use client';

import { useEffect, useState } from 'react';
import { AnalyticsOverview, getAnalyticsOverview } from '@/services/admin.service';
import { MonthlyRevenueChart } from './MonthlyRevenueChart';
import { CheckCircleIcon, RingsIcon, ShieldCheckIcon, UserIcon } from '@/components/icons';

function fmt(n: number) {
  return n.toLocaleString('en-US');
}

const TYPE_LABELS: Record<keyof AnalyticsOverview['revenue']['byType'], string> = {
  COIN_PURCHASE: 'شحن نقاط',
  VIP_SUBSCRIPTION: 'اشتراك VIP',
  VERIFICATION_FEE: 'توثيق',
};

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      setData(await getAnalyticsOverview());
    } catch {
      setError('تعذّر جلب التحليلات');
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!data) return <p className="text-sm text-ink-500">جارٍ التحميل...</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 shadow-sm">
          <p className="text-sm font-medium text-ink-500">الإيراد الكلي</p>
          <p className="font-display mt-1 text-4xl font-bold text-emerald-700">{fmt(data.revenue.total)} MAD</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-ink-500">الإيراد هذا الشهر</p>
          <p className="font-display mt-1 text-4xl font-bold text-blue-900">{fmt(data.revenue.thisMonth)} MAD</p>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">الإيراد الشهري (آخر 6 أشهر)</h3>
        <div className="mt-4">
          <MonthlyRevenueChart data={data.revenue.byMonth} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={<UserIcon className="h-5 w-5" />} color="blue" label="إجمالي الأعضاء" value={fmt(data.users.total)} />
        <StatTile
          icon={<ShieldCheckIcon className="h-5 w-5" />}
          color="emerald"
          label="أعضاء موثّقون"
          value={fmt(data.users.verified)}
        />
        <StatTile icon={<RingsIcon className="h-5 w-5" />} color="gold" label="مشتركو VIP" value={fmt(data.users.vip)} />
        <StatTile
          icon={<CheckCircleIcon className="h-5 w-5" />}
          color="rose"
          label="أعضاء جدد هذا الشهر"
          value={fmt(data.users.newThisMonth)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
          <h3 className="font-semibold text-blue-900">الإيراد حسب النوع</h3>
          <div className="mt-3 flex flex-col gap-2">
            {(Object.keys(TYPE_LABELS) as (keyof typeof TYPE_LABELS)[]).map((key) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-ink-500">{TYPE_LABELS[key]}</span>
                <span className="font-semibold text-blue-900">{fmt(data.revenue.byType[key])} MAD</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
          <h3 className="font-semibold text-blue-900">قيد الانتظار</h3>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-500">طلبات توثيق</span>
              <span className="font-semibold text-blue-900">{fmt(data.pending.verifications)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">معاملات دفع</span>
              <span className="font-semibold text-blue-900">{fmt(data.pending.payments)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">أكواد ترويجية فعّالة</span>
              <span className="font-semibold text-blue-900">{fmt(data.promos.active)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  color,
  label,
  value,
}: {
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'gold' | 'rose';
  label: string;
  value: string;
}) {
  const badgeClass = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    gold: 'bg-gold-100 text-gold-600',
    rose: 'bg-rose-100 text-rose-600',
  }[color];

  return (
    <div className="rounded-2xl border border-blue-100 bg-surface p-4 shadow-sm">
      <span className={`flex h-9 w-9 items-center justify-center rounded-full ${badgeClass}`}>{icon}</span>
      <p className="font-display mt-3 text-2xl font-bold text-blue-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}
