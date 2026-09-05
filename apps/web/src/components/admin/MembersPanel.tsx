'use client';

import { useEffect, useState } from 'react';
import { MemberListItem, downloadMembersCsv, listMembers } from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const LIMIT = 25;

function calculateAge(birthDate: string) {
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

export function MembersPanel() {
  const { dict } = useAdminDict();
  const [items, setItems] = useState<MemberListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  async function refresh(currentPage: number, currentSearch: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await listMembers(currentSearch, currentPage, LIMIT);
      setItems(data.items);
      setTotal(data.total);
    } catch {
      setError(dict.members.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    refresh(1, search);
  }

  async function handleExport() {
    setExporting(true);
    try {
      await downloadMembersCsv();
    } finally {
      setExporting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onSearchSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            id="memberSearch"
            placeholder={dict.members.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" className="text-sm">
          {dict.members.search}
        </Button>
        <Button type="button" variant="outline" loading={exporting} onClick={handleExport} className="text-sm">
          {dict.members.export}
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-ink-500">{dict.common.loading}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-surface shadow-sm">
          {error && <p className="p-4 text-sm text-red-500">{error}</p>}
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-blue-100 text-right text-ink-500">
                <th className="px-4 py-3 font-medium">{dict.members.columnName}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnPhone}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnEmail}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnCity}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnCountry}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnVerification}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnTier}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnCoins}</th>
                <th className="px-4 py-3 font-medium">{dict.members.columnJoined}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-blue-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-blue-900">
                    {item.profile.firstName}, {calculateAge(item.profile.birthDate)}
                  </td>
                  <td className="px-4 py-3 font-mono">{item.phoneNumber}</td>
                  <td className="px-4 py-3">{item.email ?? '—'}</td>
                  <td className="px-4 py-3">{item.profile.currentCity}</td>
                  <td className="px-4 py-3">{item.profile.residenceCountry}</td>
                  <td className="px-4 py-3">{item.verificationStatus}</td>
                  <td className="px-4 py-3">{item.subscriptionTier}</td>
                  <td className="px-4 py-3">{item.coinBalance}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-ink-500">
                    {dict.members.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && total > 0 && (
        <div className="flex items-center justify-between text-sm text-ink-500">
          <span>{dict.members.totalCount(total)}</span>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xs"
            >
              {dict.members.prev}
            </Button>
            <span>{dict.members.pageOf(page, totalPages)}</span>
            <Button
              type="button"
              variant="ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-xs"
            >
              {dict.members.next}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
