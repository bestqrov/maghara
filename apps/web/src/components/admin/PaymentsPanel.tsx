'use client';

import { useEffect, useState } from 'react';
import {
  PendingTransaction,
  approveTransaction,
  listPendingTransactions,
  rejectTransaction,
} from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Button } from '@/components/ui/Button';

export function PaymentsPanel() {
  const { dict } = useAdminDict();
  const [items, setItems] = useState<PendingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setItems(await listPendingTransactions());
    } catch {
      setError(dict.payments.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleReview(transactionId: string, approve: boolean) {
    setBusyId(transactionId);
    try {
      if (approve) await approveTransaction(transactionId);
      else await rejectTransaction(transactionId);
      setItems((prev) => prev.filter((item) => item._id !== transactionId));
    } catch {
      setError(dict.payments.errorReview);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">{dict.common.loading}</p>;

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {items.length === 0 && <p className="text-sm text-ink-500">{dict.payments.empty}</p>}

      {items.map((item) => {
        const user = typeof item.userId === 'string' ? null : item.userId;
        return (
          <div key={item._id} className="rounded-2xl border border-blue-100 bg-surface p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-blue-900">{user?.profile.firstName ?? dict.payments.unknownUser}</p>
                <p className="text-sm text-ink-500">{user?.phoneNumber ?? (typeof item.userId === 'string' ? item.userId : '')}</p>
              </div>
              <p className="font-display text-lg font-bold text-emerald-700">
                {item.amount} {item.currency}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-500">
              <span>
                {dict.payments.typeLabel}: {dict.payments.types[item.type]}
              </span>
              <span>
                {dict.payments.methodLabel}: {dict.payments.methods[item.paymentMethod]}
              </span>
              {item.txHashOrReceipt && (
                <span className="break-all">
                  {dict.payments.referenceLabel}: {item.txHashOrReceipt}
                </span>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <Button loading={busyId === item._id} onClick={() => handleReview(item._id, true)} className="text-sm">
                {dict.payments.approve}
              </Button>
              <Button
                variant="outline"
                loading={busyId === item._id}
                onClick={() => handleReview(item._id, false)}
                className="text-sm"
              >
                {dict.payments.reject}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
