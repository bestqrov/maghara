'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { acceptMatch, getMyMatches, markEngaged, MatchEntry, rejectMatch } from '@/services/matching.service';
import { getOrCreateConversation } from '@/services/chat.service';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/Button';
import { ShieldCheckIcon } from '@/components/icons';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'فـ الانتظار',
  ACCEPTED: 'متوافقين',
  REJECTED: 'مرفوض',
  ENGAGED: 'مخطوبين 💍',
};

export default function MatchesPage() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  const [matches, setMatches] = useState<MatchEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setMatches(await getMyMatches());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    refresh();
  }, [token, hasHydrated, router]);

  async function handleAccept(matchId: string) {
    setBusyId(matchId);
    try {
      await acceptMatch(matchId);
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(matchId: string) {
    setBusyId(matchId);
    try {
      await rejectMatch(matchId);
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function handleEngaged(matchId: string) {
    setBusyId(matchId);
    try {
      await markEngaged(matchId);
      await refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function openChat(matchId: string) {
    const conversation = await getOrCreateConversation(matchId);
    router.push(`/chat/${conversation._id}?matchId=${matchId}`);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <NavBar />
      <h1 className="text-xl font-bold text-emerald-700">الاهتمامات والمطابقات</h1>

      {loading ? (
        <p className="text-center text-sm text-ink-500">تحميل...</p>
      ) : matches.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-500">ماعندكش حتى اهتمام دابا</p>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((match) => {
            const photo = match.otherUser.profile.photos[0] ?? 'https://placehold.co/100x100/eef6f0/2f7a52?text=Z';
            const isBusy = busyId === match._id;
            return (
              <div key={match._id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={match.otherUser.profile.firstName} className="h-14 w-14 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-emerald-900">{match.otherUser.profile.firstName}</p>
                    {match.otherUser.isVerified && <ShieldCheckIcon className="h-4 w-4 text-gold-600" />}
                  </div>
                  <p className="text-xs text-ink-500">
                    {STATUS_LABEL[match.status]} · {match.direction === 'SENT' ? 'بعثتي اهتمام' : 'صيفط ليك اهتمام'}
                  </p>
                </div>

                <div className="flex gap-2">
                  {match.status === 'PENDING' && match.direction === 'RECEIVED' && (
                    <>
                      <Button variant="gold" disabled={isBusy} onClick={() => handleAccept(match._id)}>
                        قبول
                      </Button>
                      <Button variant="ghost" disabled={isBusy} onClick={() => handleReject(match._id)}>
                        رفض
                      </Button>
                    </>
                  )}
                  {(match.status === 'ACCEPTED' || match.status === 'ENGAGED') && (
                    <>
                      <Button disabled={isBusy} onClick={() => openChat(match._id)}>
                        الشات
                      </Button>
                      {match.status === 'ACCEPTED' && (
                        <Button variant="gold" disabled={isBusy} onClick={() => handleEngaged(match._id)}>
                          Mark as Engaged
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
