'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { COIN_PACKAGES, getMyTransactions, Transaction, TransactionType, VIP_PLAN } from '@/services/payments.service';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/Button';
import { PaymentModal } from '@/components/PaymentModal';

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'فـ الانتظار', className: 'bg-gold-100 text-emerald-900' },
  SUCCESS: { label: 'تأكدت ✓', className: 'bg-emerald-50 text-emerald-700' },
  FAILED: { label: 'مرفوضة', className: 'bg-rose-100 text-red-600' },
};

const TYPE_LABEL: Record<string, string> = {
  COIN_PURCHASE: 'شحن نقط',
  VIP_SUBSCRIPTION: 'اشتراك VIP',
  VERIFICATION_FEE: 'توثيق',
};

export default function StorePage() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modal, setModal] = useState<{ amount: number; type: TransactionType; title: string } | null>(null);

  async function refresh() {
    setTransactions(await getMyTransactions());
  }

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    refresh();
  }, [token, hasHydrated, router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <NavBar />
      <h1 className="text-xl font-bold text-emerald-700">المتجر والباقات</h1>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-emerald-900">باقات النقط</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {COIN_PACKAGES.map((pkg) => (
            <div key={pkg.coins} className="flex flex-col items-center gap-2 rounded-2xl border border-emerald-100 p-3">
              <span className="text-lg font-bold text-emerald-700">🪙 {pkg.coins}</span>
              <span className="text-xs text-ink-500">{pkg.priceLabel}</span>
              <Button
                variant="gold"
                onClick={() => setModal({ amount: pkg.coins, type: 'COIN_PURCHASE', title: `شحن ${pkg.coins} نقط` })}
                className="w-full text-xs"
              >
                شحن
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-emerald-900 p-5 text-white shadow-sm">
        <h2 className="font-semibold">{VIP_PLAN.label} 👑</h2>
        <p className="mt-1 text-sm text-emerald-100">شات بلا حدود، شوف جميع الزوار، وأولوية فـ الظهور</p>
        <p className="mt-2 text-lg font-bold text-gold-300">{VIP_PLAN.priceLabel}</p>
        <Button
          variant="gold"
          onClick={() => setModal({ amount: VIP_PLAN.amount, type: 'VIP_SUBSCRIPTION', title: 'اشتراك VIP' })}
          className="mt-3 w-full"
        >
          ترقى دابا
        </Button>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-emerald-900">سجل العمليات</h2>
        {transactions.length === 0 ? (
          <p className="mt-3 text-center text-sm text-ink-500">ماكاين حتى عملية دابا</p>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            {transactions.map((t) => (
              <div key={t._id} className="flex items-center justify-between rounded-xl border border-emerald-50 p-3">
                <div>
                  <p className="text-sm font-medium text-ink-700">{TYPE_LABEL[t.type]}</p>
                  <p className="text-xs text-ink-500">
                    {t.amount} {t.currency}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_LABEL[t.status].className}`}>
                  {STATUS_LABEL[t.status].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {modal && (
        <PaymentModal
          amount={modal.amount}
          type={modal.type}
          title={modal.title}
          onClose={() => setModal(null)}
          onSuccess={refresh}
        />
      )}
    </main>
  );
}
