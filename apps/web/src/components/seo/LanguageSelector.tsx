'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/seo';

const LANGUAGE_META: Record<Locale, { flag: string; nativeName: string }> = {
  ar: { flag: '🇲🇦', nativeName: 'العربية' },
  fr: { flag: '🇫🇷', nativeName: 'Français' },
  en: { flag: '🇬🇧', nativeName: 'English' },
  es: { flag: '🇪🇸', nativeName: 'Español' },
};

interface LanguageSelectorProps {
  currentLocale: Locale;
  /** locale -> path, e.g. { ar: '/ar/zawaj-casablanca', fr: '/fr/marriage-casablanca', ... } */
  hrefByLocale: Record<Locale, string>;
  label: string;
}

export function LanguageSelector({ currentLocale, hrefByLocale, label }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const current = LANGUAGE_META[currentLocale];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-surface px-3 py-1.5 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.nativeName}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-blue-400" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute end-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-2xl border border-blue-100 bg-surface py-1 shadow-lg">
          {(Object.keys(LANGUAGE_META) as Locale[]).map((locale) => {
            const meta = LANGUAGE_META[locale];
            const active = locale === currentLocale;
            return (
              <Link
                key={locale}
                href={hrefByLocale[locale]}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                  active ? 'bg-rose-50 font-semibold text-rose-600' : 'text-blue-900 hover:bg-blue-50'
                }`}
              >
                <span aria-hidden="true">{meta.flag}</span>
                <span>{meta.nativeName}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
