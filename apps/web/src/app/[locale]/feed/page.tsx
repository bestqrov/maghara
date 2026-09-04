'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, VerificationStatusResponse } from '@/services/verification.service';
import { getMe } from '@/services/users.service';
import { searchProfiles, sendInterest, SearchFilters, SearchResultProfile, DAILY_FREE_INTERESTS } from '@/services/matching.service';
import { VerificationBanner } from '@/components/VerificationBanner';
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt';
import { SearchFiltersBar } from '@/components/SearchFiltersBar';
import { ProfileCard } from '@/components/ProfileCard';
import { NavBar } from '@/components/NavBar';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { recordVisit } from '@/services/visitors.service';
import { useAppDict, withLocale } from '@/hooks/useLocale';

export default function FeedPage() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const { token, user, hasHydrated } = useAuthStore();
  const [verification, setVerification] = useState<VerificationStatusResponse | null>(null);
  const [results, setResults] = useState<SearchResultProfile[]>([]);
  const [dailyInterestsSent, setDailyInterestsSent] = useState(0);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVip = user?.subscriptionTier === 'VIP' || user?.subscriptionTier === 'CROSS_BORDER_VIP';

  const runSearch = useCallback(
    async (filters: SearchFilters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchProfiles(filters);
        setResults(data);
      } catch {
        setError(dict.feed.errorSearchFailed);
      } finally {
        setLoading(false);
      }
    },
    [dict],
  );

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace(withLocale(locale, '/login'));
      return;
    }
    getMyVerificationStatus().then(setVerification).catch(() => setVerification(null));
    getMe().then((me) => setDailyInterestsSent(me.dailyInterestsSent)).catch(() => {});
    runSearch({ scope: 'LOCAL' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hasHydrated, router]);

  async function handleSendInterest(receiverId: string) {
    try {
      await sendInterest(receiverId);
      setSentIds((prev) => new Set(prev).add(receiverId));
      setDailyInterestsSent((n) => n + 1);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        dict.feed.errorSendInterestFailed;
      setError(message);
    }
  }

  if (!token || !user) return null;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(60% 40% at 85% 0%, var(--color-rose-50) 0%, var(--background) 65%)',
      }}
    >
      <WeddingEmblem className="spin-anim pointer-events-none absolute right-1/2 top-0 h-[520px] w-[520px] -translate-y-1/3 translate-x-1/2 text-blue-700 opacity-[0.05] sm:h-[680px] sm:w-[680px]" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
        <NavBar />
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-bold text-blue-900">{dict.feed.greeting(user.profile.firstName)}</h1>
            <p className="text-sm text-ink-500">
              {user.profile.currentCity} · {user.profile.residenceCountry}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isVip && (
              <span className="rounded-full border border-rose-200 bg-surface px-3 py-1 text-xs font-semibold text-rose-600">
                {dict.feed.interestsToday(dailyInterestsSent, DAILY_FREE_INTERESTS)}
              </span>
            )}
          </div>
        </header>

        {verification && <VerificationBanner status={verification.verificationStatus} />}
        <PushNotificationPrompt />

        <SearchFiltersBar onSearch={runSearch} loading={loading} />

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        {results.length === 0 && !loading ? (
          <p className="py-10 text-center text-sm text-ink-500">{dict.feed.noResults}</p>
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
      </div>
    </main>
  );
}
