import Link from 'next/link';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { Button } from '@/components/ui/Button';
import { CheckCircleIcon, ShieldCheckIcon } from '@/components/icons';
import { SeoProfileCard } from './SeoProfileCard';
import { SeoHeader } from './SeoHeader';
import { LanguageSelector } from './LanguageSelector';
import { withLocale, type Locale, type SeoLocationEntry, type SeoLocaleTranslation } from '@/lib/seo';
import type { SeoDictionary } from '@/lib/seoDictionary';
import type { PublicPreviewProfile } from '@/services/public.service';

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-14 bg-rose-300 sm:w-20" />
      <span className="h-1.5 w-1.5 rotate-45 bg-rose-500" />
      <span className="h-px w-14 bg-rose-300 sm:w-20" />
    </div>
  );
}

export function SeoLandingContent({
  locale,
  entry,
  translation,
  dict,
  hrefByLocale,
  profiles,
}: {
  locale: Locale;
  entry: SeoLocationEntry;
  translation: SeoLocaleTranslation;
  dict: SeoDictionary;
  hrefByLocale: Record<Locale, string>;
  profiles: PublicPreviewProfile[];
}) {
  const registerHref = `${withLocale(locale, '/register')}?ref=seo-${locale}-${translation.slug}`;
  const loginHref = withLocale(locale, '/login');

  return (
    <main className="flex min-h-screen flex-col">
      <SeoHeader locale={locale} hrefByLocale={hrefByLocale} dict={dict} />

      <section
        className="relative overflow-hidden px-4 pb-14 pt-14 sm:pt-16"
        style={{
          background: 'radial-gradient(60% 55% at 85% 0%, var(--color-rose-50) 0%, var(--background) 65%)',
        }}
      >
        <WeddingEmblem className="spin-anim pointer-events-none absolute right-1/2 top-1/3 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/2 text-blue-700 opacity-[0.05] sm:h-[560px] sm:w-[560px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="hero-enter inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-rose-600">
            {dict.badge}
          </span>

          <h1
            className="font-display hero-enter mx-auto mt-6 max-w-3xl text-3xl font-bold leading-[1.4] text-blue-900 sm:text-4xl"
            style={{ animationDelay: '0.1s' }}
          >
            {translation.h1}
          </h1>

          <p
            className="hero-enter mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg"
            style={{ animationDelay: '0.2s' }}
          >
            {translation.heroText}
          </p>

          <div
            className="hero-enter mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: '0.3s' }}
          >
            <Link href={registerHref}>
              <Button variant="rose" className="w-full px-9 py-3.5 text-base shadow-lg shadow-rose-500/20 sm:w-auto">
                {dict.ctaRegister}
              </Button>
            </Link>
            <Link href={loginHref}>
              <Button variant="outline" className="w-full px-9 py-3.5 text-base sm:w-auto">
                {dict.ctaLogin}
              </Button>
            </Link>
          </div>

          <div
            className="hero-enter mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            style={{ animationDelay: '0.4s' }}
          >
            {dict.trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
                <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                {point}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <OrnamentDivider />
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-14">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-blue-900">
            {dict.membersHeading(translation.displayName)}
          </h2>
          <p className="mt-2 text-sm text-ink-500">{dict.membersSubheading}</p>
        </div>

        {profiles.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {profiles.map((profile, i) => {
              const locationLabel =
                entry.type === 'city' ? translation.displayName : `${profile.currentCity} · ${translation.displayName}`;
              return (
                <SeoProfileCard
                  key={`${profile.firstName}-${i}`}
                  profile={profile}
                  locale={locale}
                  locationLabel={locationLabel}
                />
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-blue-100 bg-white p-8 text-center text-sm text-ink-500">
            {dict.emptyState(translation.displayName)}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-rose-100 bg-rose-50/60 p-8 text-center">
          <ShieldCheckIcon className="h-8 w-8 text-rose-500" />
          <h3 className="font-display text-lg font-bold text-blue-900">{dict.verifyHeading}</h3>
          <p className="max-w-md text-sm text-ink-500">{dict.verifyText}</p>
          <Link href={registerHref}>
            <Button variant="rose" className="mt-2 px-9 py-3.5 text-base shadow-lg shadow-rose-500/20">
              {dict.verifyButton}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-blue-100/70 px-4 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-center">
          <LanguageSelector currentLocale={locale} hrefByLocale={hrefByLocale} label={dict.languageLabel} />
        </div>
      </footer>
    </main>
  );
}
