'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, VerificationStatusResponse } from '@/services/verification.service';
import { getMe } from '@/services/users.service';
import { searchProfiles, sendInterest, SearchFilters, SearchResultProfile, DAILY_FREE_INTERESTS } from '@/services/matching.service';
import { VerificationBanner } from '@/components/VerificationBanner';
import { SearchFiltersBar } from '@/components/SearchFiltersBar';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/ui/Button';
import { NavBar } from '@/components/NavBar';
import { recordVisit } from '@/services/visitors.service';

export default function FeedPage() {
  const router = useRouter();
  const { token, user, hasHydrated, logout } = useAuthStore();
  const [verification, setVerification] = useState<VerificationStatusResponse | null>(null);
  const [results, setResults] = useState<SearchResultProfile[]>([]);
  const [dailyInterestsSent, setDailyInterestsSent] = useState(0);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVip = user?.subscriptionTier === 'VIP' || user?.subscriptionTier === 'CROSS_BORDER_VIP';

  const runSearch = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProfiles(filters);
      setResults(data);
    } catch {
      setError('ماقدرناش نجيبو النتائج، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    getMyVerificationStatus().then(setVerification).catch(() => setVerification(null));
    getMe().then((me) => setDailyInterestsSent(me.dailyInterestsSent)).catch(() => {});
    runSearch({ scope: 'LOCAL' });
  }, [token, hasHydrated, router, runSearch]);

  async function handleSendInterest(receiverId: string) {
    try {
      await sendInterest(receiverId);
      setSentIds((prev) => new Set(prev).add(receiverId));
      setDailyInterestsSent((n) => n + 1);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'ماقدرناش نبعثو الاهتمام';
      setError(message);
    }
  }

  if (!token || !user) return null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <NavBar />
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-700">أهلاً {user.profile.firstName} 👋</h1>
          <p className="text-sm text-ink-500">
            {user.profile.currentCity} · {user.profile.residenceCountry}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isVip && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {dailyInterestsSent}/{DAILY_FREE_INTERESTS} اهتمامات اليوم
            </span>
          )}
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            خروج
          </Button>
        </div>
      </header>

      {verification && <VerificationBanner status={verification.verificationStatus} />}

      <SearchFiltersBar onSearch={runSearch} loading={loading} />

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      {results.length === 0 && !loading ? (
        <p className="py-10 text-center text-sm text-ink-500">ماكاين حتى نتيجة دابا، حاول تبدل الفلاتر</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <ProfileCard
              key={result._id}
              result={result}
              onSendInterest={handleSendInterest}
              onView={recordVisit}
              sending={false}
              sent={sentIds.has(result._id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
