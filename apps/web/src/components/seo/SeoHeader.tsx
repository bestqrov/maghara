import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { LanguageSelector } from './LanguageSelector';
import { brandNameFor, withLocale, type Locale } from '@/lib/seo';
import type { SeoDictionary } from '@/lib/seoDictionary';

export function SeoHeader({
  locale,
  hrefByLocale,
  dict,
}: {
  locale: Locale;
  hrefByLocale: Record<Locale, string>;
  dict: SeoDictionary;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-blue-100/70 bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display flex items-center gap-2 text-lg font-bold text-blue-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" className="h-10 w-auto" />
          {brandNameFor(locale)}
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSelector currentLocale={locale} hrefByLocale={hrefByLocale} label={dict.languageLabel} />
          <Link
            href={withLocale(locale, '/login')}
            className="hidden text-sm font-semibold text-blue-700 hover:text-blue-900 sm:block"
          >
            {dict.ctaLogin}
          </Link>
          <Link href={withLocale(locale, '/register')}>
            <Button variant="rose" className="px-5 py-2 text-sm">
              {dict.ctaRegisterShort}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
