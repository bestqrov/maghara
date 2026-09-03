'use client';

import { useEffect, useState } from 'react';
import { ReferralStats, listReferrals } from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';

export function ReferralsPanel() {
  const { dict } = useAdminDict();
  const [items, setItems] = useState<ReferralStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setItems(await listReferrals());
    } catch {
      setError(dict.referrals.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p className="text-sm text-ink-500">{dict.common.loading}</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-surface shadow-sm">
      {error && <p className="p-4 text-sm text-red-500">{error}</p>}
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-blue-100 text-right text-ink-500">
            <th className="px-4 py-3 font-medium">{dict.referrals.columnMember}</th>
            <th className="px-4 py-3 font-medium">{dict.referrals.columnCode}</th>
            <th className="px-4 py-3 font-medium">{dict.referrals.columnTotal}</th>
            <th className="px-4 py-3 font-medium">{dict.referrals.columnVerified}</th>
            <th className="px-4 py-3 font-medium">{dict.referrals.columnBalance}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-b border-blue-50 last:border-0">
              <td className="px-4 py-3">
                <p className="font-semibold text-blue-900">{item.firstName}</p>
                <p className="text-xs text-ink-500">{item.phoneNumber}</p>
              </td>
              <td className="px-4 py-3 font-mono text-blue-700">{item.referralCode}</td>
              <td className="px-4 py-3">{item.totalReferred}</td>
              <td className="px-4 py-3">{item.verifiedReferred}</td>
              <td className="px-4 py-3">{item.coinBalance}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-ink-500">
                {dict.referrals.empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
