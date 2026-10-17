'use client';

import { useEffect, useState } from 'react';
import {
  PendingVerification,
  approveVerification,
  fetchVerificationDocument,
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
  const [comparing, setComparing] = useState<{ userId: string; id: string; selfie: string } | null>(null);

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

  async function toggleCompare(userId: string) {
    if (comparing?.userId === userId) {
      setComparing(null);
      return;
    }
    try {
      const [id, selfie] = await Promise.all([
        fetchVerificationDocument(userId, 'id'),
        fetchVerificationDocument(userId, 'selfie'),
      ]);
      setComparing({ userId, id, selfie });
    } catch {
      setError(dict.verifications.errorFetch);
    }
  }

  function faceBadge(item: PendingVerification) {
    const docs = item.verificationDocuments;
    if (!docs?.hasSelfie) return null;
    const match = docs.faceMatch;
    const v = dict.verifications;
    const [text, tone] = !match
      ? [v.faceChecking, 'bg-blue-50 text-blue-700']
      : match.status === 'MATCH'
        ? [match.strong ? v.faceStrong : v.faceMatch, 'bg-emerald-50 text-emerald-700']
        : match.status === 'NO_MATCH'
          ? [v.faceNoMatch, 'bg-red-50 text-red-600']
          : [v.faceError, 'bg-amber-50 text-amber-700'];
    // Distance 0 = identical, ~1 = unrelated; shown as a rough similarity percentage.
    const percent = match?.distance !== undefined ? Math.max(0, Math.round((1 - match.distance) * 100)) : null;
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className={`rounded-full px-3 py-1 ${tone}`}>
          {text}
          {percent !== null && ` · ${v.similarity(percent)}`}
        </span>
        {match?.profileMatches !== null && match?.profileMatches !== undefined && (
          <span
            className={`rounded-full px-3 py-1 ${match.profileMatches ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}
          >
            {match.profileMatches ? v.profileMatch : v.profileNoMatch}
          </span>
        )}
      </div>
    );
  }

  async function openDocument(userId: string, kind: 'id' | 'residency' | 'selfie') {
    // Open the tab synchronously (inside the click) so popup blockers allow it, then fill it.
    const tab = window.open('', '_blank');
    try {
      const url = await fetchVerificationDocument(userId, kind);
      if (tab) tab.location.href = url;
    } catch {
      tab?.close();
      setError(dict.verifications.errorFetch);
    }
  }

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
              <p className="text-sm text-ink-500">
                {item.phoneNumber}
                {item.verificationDocuments?.documentType &&
                  ` · ${item.verificationDocuments.documentType === 'PASSPORT' ? dict.verifications.passport : dict.verifications.idCard}`}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              {item.verificationDocuments?.hasIdDocument && (
                <button
                  type="button"
                  onClick={() => openDocument(item._id, 'id')}
                  className="rounded-lg border border-blue-100 px-3 py-1.5 text-blue-700 hover:bg-blue-50"
                >
                  {dict.verifications.idDocument}
                </button>
              )}
              {item.verificationDocuments?.hasSelfie && (
                <button
                  type="button"
                  onClick={() => openDocument(item._id, 'selfie')}
                  className="rounded-lg border border-blue-100 px-3 py-1.5 text-blue-700 hover:bg-blue-50"
                >
                  {dict.verifications.selfie}
                </button>
              )}
              {item.verificationDocuments?.hasResidencyDocument && (
                <button
                  type="button"
                  onClick={() => openDocument(item._id, 'residency')}
                  className="rounded-lg border border-blue-100 px-3 py-1.5 text-blue-700 hover:bg-blue-50"
                >
                  {dict.verifications.residencyDocument}
                </button>
              )}
            </div>
          </div>

          {faceBadge(item)}

          {item.verificationDocuments?.hasIdDocument && item.verificationDocuments?.hasSelfie && (
            <button
              type="button"
              onClick={() => toggleCompare(item._id)}
              className="mt-3 text-sm font-semibold text-blue-700 underline"
            >
              {comparing?.userId === item._id ? dict.verifications.hideCompare : dict.verifications.compare}
            </button>
          )}
          {comparing?.userId === item._id && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comparing.id} alt={dict.verifications.idDocument} className="w-full rounded-xl border border-blue-100 object-contain" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={comparing.selfie} alt={dict.verifications.selfie} className="w-full rounded-xl border border-blue-100 object-contain" />
            </div>
          )}

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
