'use client';

import { useEffect, useState } from 'react';
import { getReferralInfo, ReferralInfo } from '@/services/promos.service';
import { Button } from './ui/Button';
import { CheckCircleIcon } from './icons';
import { useAppDict } from '@/hooks/useLocale';

function WhatsAppIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.6-1.5-1.8-.1-.2 0-.4.1-.5.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.5-.3z" />
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.1 14.9 3.7 13.5 3.7 12c0-4.6 3.7-8.3 8.3-8.3s8.3 3.7 8.3 8.3-3.7 8.2-8.3 8.2z" />
    </svg>
  );
}

function FacebookIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 22v-8.5h2.9l.4-3.4h-3.3V7.9c0-1 .3-1.6 1.7-1.6h1.7V3.3C16.6 3.2 15.6 3 14.5 3c-2.4 0-4 1.5-4 4.2v2h-2.7v3.4h2.7V22h3z" />
    </svg>
  );
}

export function ReferralShareCard() {
  const { dict } = useAppDict();
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getReferralInfo()
      .then(setInfo)
      .catch(() => setInfo(null));
  }, []);

  if (!info) return null;

  const shareText = dict.referralCard.shareText(info.referralLink);

  async function handleCopy() {
    await navigator.clipboard.writeText(info!.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-rose-100 bg-rose-50/60 p-6">
      <h3 className="font-display text-lg font-bold text-blue-900">{dict.referralCard.title}</h3>
      <p className="mt-1 text-sm text-ink-500">{dict.referralCard.subtitle}</p>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-100 bg-surface px-4 py-3">
        <span className="font-display font-bold tracking-widest text-blue-900">{info.referralCode}</span>
        <Button type="button" variant="ghost" onClick={handleCopy} className="px-3 py-1.5 text-xs">
          {copied ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <CheckCircleIcon className="h-4 w-4" /> {dict.referralCard.copied}
            </span>
          ) : (
            dict.referralCard.copyLink
          )}
        </Button>
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {dict.referralCard.whatsapp}
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(info.referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1877F2] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <FacebookIcon className="h-4 w-4" />
          {dict.referralCard.facebook}
        </a>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-center text-xs text-ink-500">
        <span>
          <span className="font-display block text-base font-bold text-blue-900">{info.totalReferred}</span>
          {dict.referralCard.totalReferredLabel}
        </span>
        <span>
          <span className="font-display block text-base font-bold text-blue-900">{info.verifiedReferred}</span>
          {dict.referralCard.verifiedReferredLabel}
        </span>
      </div>
    </div>
  );
}
