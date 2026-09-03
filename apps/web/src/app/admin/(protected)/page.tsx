'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin.store';
import { VerificationsPanel } from '@/components/admin/VerificationsPanel';
import { PaymentsPanel } from '@/components/admin/PaymentsPanel';
import { PromosPanel } from '@/components/admin/PromosPanel';

type Tab = 'verifications' | 'payments' | 'promos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'verifications', label: 'طلبات التوثيق' },
  { id: 'payments', label: 'المدفوعات' },
  { id: 'promos', label: 'الأكواد الترويجية' },
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
        <nav className="flex gap-2 rounded-2xl border border-blue-100 bg-surface p-1.5 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl py-2 text-center text-sm font-semibold transition ${
                tab === t.id ? 'bg-rose-500 text-white' : 'text-blue-700 hover:bg-rose-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'verifications' && <VerificationsPanel />}
        {tab === 'payments' && <PaymentsPanel />}
        {tab === 'promos' && <PromosPanel />}
      </div>
    </main>
  );
}
