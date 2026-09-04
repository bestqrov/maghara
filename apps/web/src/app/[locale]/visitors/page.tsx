'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getMyVisitors, VisitorEntry } from '@/services/visitors.service';
import { BlurredImage } from '@/components/BlurredImage';
import { OnlineDot } from '@/components/OnlineDot';
import { NavBar } from '@/components/NavBar';
import { useAppDict, withLocale } from '@/hooks/useLocale';

export default function VisitorsPage() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const { token, hasHydrated } = useAuthStore();
  const [visitors, setVisitors] = useState<VisitorEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace(withLocale(locale, '/login'));
      return;
    }
    getMyVisitors()
      .then(setVisitors)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, hasHydrated, router]);

  const lockedCount = visitors.filter((v) => v.locked).length;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <NavBar />
      <div>
        <h1 className="text-xl font-bold text-emerald-700">{dict.visitors.title}</h1>
        <p className="mt-1 text-sm text-ink-500">{dict.visitors.subtitle}</p>
      </div>

      {lockedCount > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-gold-100 px-4 py-3">
          <p className="text-sm font-semibold text-emerald-900">{dict.visitors.lockedBanner(lockedCount)}</p>
          <span className="text-xl">🔒</span>
        </div>
      )}

      {loading ? (
        <p className="text-center text-sm text-ink-500">{dict.visitors.loading}</p>
      ) : visitors.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink-500">{dict.visitors.empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {visitors.map((entry, index) => {
            const photo = entry.visitor?.profile.photos[0] ?? 'https://placehold.co/300x300/eef6f0/2f7a52?text=Zawaj';
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="relative w-full">
                  <BlurredImage
                    src={photo}
                    alt={entry.visitor?.profile.firstName ?? dict.visitors.unknownVisitorAlt}
                    isBlurred={entry.locked}
                    className="aspect-square w-full"
                    lockLabel={dict.visitors.lockLabel}
                  />
                  {!entry.locked && entry.visitor?.isOnline && <OnlineDot className="bottom-1.5 end-1.5 h-3.5 w-3.5" />}
                </div>
                <p className="text-xs font-medium text-ink-700">
                  {entry.locked ? dict.visitors.lockedName : entry.visitor?.profile.firstName}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
