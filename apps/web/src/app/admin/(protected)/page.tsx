'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin.store';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { VerificationsPanel } from '@/components/admin/VerificationsPanel';
import { PaymentsPanel } from '@/components/admin/PaymentsPanel';
import { PromosPanel } from '@/components/admin/PromosPanel';
import { ReferralsPanel } from '@/components/admin/ReferralsPanel';
import { SettingsPanel } from '@/components/admin/SettingsPanel';
import { PaymentSettingsPanel } from '@/components/admin/PaymentSettingsPanel';
import { AnalyticsPanel } from '@/components/admin/AnalyticsPanel';
import { SignupCampaignPanel } from '@/components/admin/SignupCampaignPanel';
import { MembersPanel } from '@/components/admin/MembersPanel';
import { AdSettingsPanel } from '@/components/admin/AdSettingsPanel';
import { AdminLocaleToggle } from '@/components/admin/AdminLocaleToggle';

type Tab =
  | 'analytics'
  | 'verifications'
  | 'payments'
  | 'paymentSettings'
  | 'promos'
  | 'referrals'
  | 'signupCampaign'
  | 'members'
  | 'ads'
  | 'settings';

export default function AdminDashboardPage() {
  const router = useRouter();
  const logout = useAdminStore((s) => s.logout);
  const { dict } = useAdminDict();
  const [tab, setTab] = useState<Tab>('analytics');

  const TABS: { id: Tab; label: string }[] = [
    { id: 'analytics', label: dict.dashboard.tabAnalytics },
    { id: 'verifications', label: dict.dashboard.tabVerifications },
    { id: 'payments', label: dict.dashboard.tabPayments },
    { id: 'paymentSettings', label: dict.dashboard.tabPaymentSettings },
    { id: 'promos', label: dict.dashboard.tabPromos },
    { id: 'referrals', label: dict.dashboard.tabReferrals },
    { id: 'signupCampaign', label: dict.dashboard.tabSignupCampaign },
    { id: 'members', label: dict.dashboard.tabMembers },
    { id: 'ads', label: dict.dashboard.tabAds },
    { id: 'settings', label: dict.dashboard.tabSettings },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-blue-100 bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" className="h-8 w-auto" />
            <h1 className="font-display text-lg font-bold text-blue-900">{dict.dashboard.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <AdminLocaleToggle />
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace('/admin/login');
              }}
              className="text-sm font-semibold text-blue-700 hover:text-rose-600"
            >
              {dict.dashboard.logout}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
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

        {tab === 'analytics' && <AnalyticsPanel />}
        {tab === 'verifications' && <VerificationsPanel />}
        {tab === 'payments' && <PaymentsPanel />}
        {tab === 'paymentSettings' && <PaymentSettingsPanel />}
        {tab === 'promos' && <PromosPanel />}
        {tab === 'referrals' && <ReferralsPanel />}
        {tab === 'signupCampaign' && <SignupCampaignPanel />}
        {tab === 'members' && <MembersPanel />}
        {tab === 'ads' && <AdSettingsPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </main>
  );
}
