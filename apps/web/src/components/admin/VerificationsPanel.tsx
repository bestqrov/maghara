'use client';

import { useEffect, useState } from 'react';
import {
  PendingVerification,
  approveVerification,
  listPendingVerifications,
  rejectVerification,
} from '@/services/admin.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function VerificationsPanel() {
  const { dict } = useAdminDict();
  const [items, setItems] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [reasonById, setReasonById] = useState<Record<string, string>>({});
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setItems(await listPendingVerifications());
    } catch {
      setError(dict.verifications.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleApprove(userId: string) {
    setBusyId(userId);
    try {
      await approveVerification(userId);
      setItems((prev) => prev.filter((item) => item._id !== userId));
    } catch {
      setError(dict.verifications.errorApprove);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(userId: string) {
    setBusyId(userId);
    try {
      await rejectVerification(userId, reasonById[userId]);
      setItems((prev) => prev.filter((item) => item._id !== userId));
      setRejectingId(null);
    } catch {
      setError(dict.verifications.errorReject);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">{dict.common.loading}</p>;

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      {items.length === 0 && <p className="text-sm text-ink-500">{dict.verifications.empty}</p>}

      {items.map((item) => (
        <div key={item._id} className="rounded-2xl border border-blue-100 bg-surface p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-blue-900">{item.profile.firstName}</p>
              <p className="text-sm text-ink-500">{item.phoneNumber}</p>
            </div>
            <div className="flex gap-2 text-sm">
              {item.verificationDocuments?.idDocumentUrl && (
                <a
                  href={item.verificationDocuments.idDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-blue-100 px-3 py-1.5 text-blue-700 hover:bg-blue-50"
                >
                  {dict.verifications.idDocument}
                </a>
              )}
              {item.verificationDocuments?.residencyDocumentUrl && (
                <a
                  href={item.verificationDocuments.residencyDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-blue-100 px-3 py-1.5 text-blue-700 hover:bg-blue-50"
                >
                  {dict.verifications.residencyDocument}
                </a>
              )}
            </div>
          </div>

          {rejectingId === item._id ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Input
                  id={`reason-${item._id}`}
                  label={dict.verifications.rejectReasonLabel}
                  value={reasonById[item._id] ?? ''}
                  onChange={(e) => setReasonById((prev) => ({ ...prev, [item._id]: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="rose"
                  loading={busyId === item._id}
                  onClick={() => handleReject(item._id)}
                  className="text-sm"
                >
                  {dict.verifications.confirmReject}
                </Button>
                <Button variant="ghost" onClick={() => setRejectingId(null)} className="text-sm">
                  {dict.verifications.cancel}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <Button loading={busyId === item._id} onClick={() => handleApprove(item._id)} className="text-sm">
                {dict.verifications.approve}
              </Button>
              <Button variant="outline" onClick={() => setRejectingId(item._id)} className="text-sm">
                {dict.verifications.reject}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
