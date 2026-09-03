'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin.store';
import { VerificationsPanel } from '@/components/admin/VerificationsPanel';
import { PaymentsPanel } from '@/components/admin/PaymentsPanel';
import { PromosPanel } from '@/components/admin/PromosPanel';
import { ReferralsPanel } from '@/components/admin/ReferralsPanel';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { PaymentSettingsPanel } from '@/components/admin/PaymentSettingsPanel';

type Tab = 'verifications' | 'payments' | 'paymentSettings' | 'promos' | 'referrals' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'verifications', label: 'طلبات التوثيق' },
  { id: 'payments', label: 'المدفوعات' },
  { id: 'paymentSettings', label: 'حسابات الاستلام' },
  { id: 'promos', label: 'الأكواد الترويجية' },
  { id: 'referrals', label: 'الإحالات' },
  { id: 'settings', label: 'الإعدادات' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const logout = useAdminStore((s) => s.logout);
  const [tab, setTab] = useState<Tab>('verifications');

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-blue-100 bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" className="h-8 w-auto" />
            <h1 className="font-display text-lg font-bold text-blue-900">لوحة تحكم المشرف</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace('/admin/login');
            }}
            className="text-sm font-semibold text-blue-700 hover:text-rose-600"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <nav className="scroll-hide flex gap-2 overflow-x-auto rounded-2xl border border-blue-100 bg-surface p-1.5 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-center text-sm font-semibold whitespace-nowrap transition ${
                tab === t.id ? 'bg-rose-500 text-white' : 'text-blue-700 hover:bg-rose-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'verifications' && <VerificationsPanel />}
        {tab === 'payments' && <PaymentsPanel />}
        {tab === 'paymentSettings' && <PaymentSettingsPanel />}
        {tab === 'promos' && <PromosPanel />}
        {tab === 'referrals' && <ReferralsPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </main>
  );
}
