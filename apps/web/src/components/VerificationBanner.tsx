'use client';

import { ShieldCheckIcon } from './icons';
import { LocaleLink } from './LocaleLink';
import { useAppDict } from '@/hooks/useLocale';

export function VerificationBanner({ status }: { status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' }) {
  const { dict } = useAppDict();
  if (status === 'VERIFIED') return null;

  const COPY: Record<string, { title: string; subtitle: string; tone: string }> = {
    UNVERIFIED: {
      title: dict.verificationBanner.unverifiedTitle,
      subtitle: dict.verificationBanner.unverifiedSubtitle,
      tone: 'bg-gold-100 text-blue-900',
    },
    PENDING: {
      title: dict.verificationBanner.pendingTitle,
      subtitle: dict.verificationBanner.pendingSubtitle,
      tone: 'bg-blue-50 text-blue-700',
    },
    REJECTED: {
      title: dict.verificationBanner.rejectedTitle,
      subtitle: dict.verificationBanner.rejectedSubtitle,
      tone: 'bg-rose-100 text-rose-700',
    },
  };

  const copy = COPY[status];

  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${copy.tone}`}>
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-6 w-6 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{copy.title}</p>
          <p className="text-xs opacity-80">{copy.subtitle}</p>
        </div>
      </div>
      {status !== 'PENDING' && (
        <LocaleLink
          href="/verification"
          className="whitespace-nowrap rounded-xl bg-white/70 px-3 py-1.5 text-xs font-semibold text-blue-900 transition hover:bg-surface"
        >
          {dict.verificationBanner.verifyNow}
        </LocaleLink>
      )}
    </div>
  );
}
