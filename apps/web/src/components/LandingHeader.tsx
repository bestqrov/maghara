'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from '@/components/seo/LanguageSelector';
import { useAppDict } from '@/hooks/useLocale';
import { withLocale, SUPPORTED_LOCALES, type Locale } from '@/lib/seo';
import { LANDING_DICTIONARY } from '@/dictionaries/landing';
import { SEO_DICTIONARY } from '@/lib/seoDictionary';

export function LandingHeader() {
  const { locale } = useAppDict();
  const dict = LANDING_DICTIONARY[locale];

  const MENU_LINKS = [
    { href: '#features', label: dict.nav.features },
    { href: '#how', label: dict.nav.how },
    { href: '#trust', label: dict.nav.trust },
  ];

  // The landing page itself only exists at "/" (ar) and "/fr", "/en", "/es" —
  // no per-slug variants — so every locale maps to the same bare path.
  const hrefByLocale = SUPPORTED_LOCALES.reduce(
    (acc, l) => {
      acc[l] = l === 'ar' ? '/' : `/${l}`;
      return acc;
    },
    {} as Record<Locale, string>,
  );

  return (
    <div className="sticky top-0 z-30 border-b border-blue-100/70 bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="font-display flex items-center gap-2 text-lg font-bold text-blue-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" className="h-10 w-auto" />
          قسمة و نصيب
        </span>

        <nav className="hidden items-center gap-7 md:flex" aria-label={dict.nav.ariaLabel}>
          {MENU_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-blue-700/80 transition hover:text-blue-900"
            >
              {link.label}
            </a>
          ))}
          <span className="flex items-center gap-1.5 text-sm font-medium text-blue-700/40">
            {dict.nav.successStories}
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-400">
              {dict.nav.soon}
            </span>
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector
            currentLocale={locale}
            hrefByLocale={hrefByLocale}
            label={SEO_DICTIONARY[locale].languageLabel}
          />
          <Link
            href={withLocale(locale, '/login')}
            className="hidden text-sm font-semibold text-blue-700 hover:text-blue-900 sm:block"
          >
            {dict.nav.login}
          </Link>
          <Link href={withLocale(locale, '/register')}>
            <Button variant="rose" className="px-5 py-2 text-sm">
              {dict.nav.register}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
