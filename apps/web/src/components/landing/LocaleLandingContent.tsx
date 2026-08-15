'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/Reveal';
import { WeddingEmblem, StarSeal } from '@/components/WeddingEmblem';
import { PhoneMockup } from '@/components/PhoneMockup';
import { LandingHeader } from '@/components/LandingHeader';
import { withLocale, type Locale } from '@/lib/seo';
import { LANDING_DICTIONARY } from '@/dictionaries/landing';
import {
  ShieldCheckIcon,
  GlobeIcon,
  EyeIcon,
  ChatIcon,
  HeartIcon,
  LockClosedIcon,
  RingsIcon,
  CheckCircleIcon,
} from '@/components/icons';

const FEATURE_ICONS = [ShieldCheckIcon, GlobeIcon, EyeIcon, ChatIcon];

// Mirrors the original KEYWORD_LINKS hrefs 1:1, by index, against dict.keywords.links.
const KEYWORD_HREF_KIND: ('register' | 'trust' | 'features')[] = [
  'register',
  'trust',
  'register',
  'features',
  'features',
  'features',
  'features',
];

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-14 bg-rose-300 sm:w-20" />
      <span className="h-1.5 w-1.5 rotate-45 bg-rose-500" />
      <span className="h-px w-14 bg-rose-300 sm:w-20" />
    </div>
  );
}

export function LocaleLandingContent({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  const dict = LANDING_DICTIONARY[locale];
  const registerHref = withLocale(locale, '/register');
  const loginHref = withLocale(locale, '/login');

  useEffect(() => {
    if (hasHydrated && token) router.replace(withLocale(locale, '/feed'));
  }, [token, hasHydrated, router, locale]);

  if (!hasHydrated || token) return null;

  const heroSrc = locale === 'ar' ? '/hero.png?v=5' : `/hero-${locale}.png?v=1`;

  return (
    <main className="flex min-h-screen flex-col">
      <LandingHeader />

      {/* Hero banner */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt={dict.footer.text}
          className="h-auto max-h-[580px] w-full object-cover object-top"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40"
          style={{ background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)' }}
        />
      </div>

      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pb-16 pt-14 sm:pt-16"
        style={{
          background: 'radial-gradient(60% 55% at 85% 0%, var(--color-rose-50) 0%, var(--background) 65%)',
        }}
      >
        <WeddingEmblem className="spin-anim pointer-events-none absolute right-1/2 top-1/3 h-[520px] w-[520px] -translate-y-1/2 translate-x-1/2 text-blue-700 opacity-[0.05] sm:h-[680px] sm:w-[680px]" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Text column */}
          <div className="text-center lg:text-right">
            <span
              className="hero-enter mt-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-rose-600"
              style={{ animationDelay: '0.05s' }}
            >
              {dict.hero.badge}
            </span>

            <h1
              className="font-display hero-enter mx-auto mt-6 max-w-xl text-4xl font-bold leading-[1.3] text-blue-900 sm:text-5xl lg:mx-0"
              style={{ animationDelay: '0.1s' }}
            >
              {dict.hero.h1Main} <span className="text-rose-500">{dict.hero.h1Accent}</span>
            </h1>

            <p
              className="hero-enter mx-auto mt-5 max-w-md text-base leading-relaxed text-ink-500 sm:text-lg lg:mx-0"
              style={{ animationDelay: '0.2s' }}
            >
              {dict.hero.text}
            </p>

            <div
              className="hero-enter mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
              style={{ animationDelay: '0.3s' }}
            >
              <Link href={registerHref}>
                <Button variant="rose" className="w-full px-9 py-3.5 text-base shadow-lg shadow-rose-500/20 sm:w-auto">
                  {dict.hero.ctaRegister}
                </Button>
              </Link>
              <Link href={loginHref}>
                <Button variant="outline" className="w-full px-9 py-3.5 text-base sm:w-auto">
                  {dict.hero.ctaLogin}
                </Button>
              </Link>
            </div>

            <p className="hero-enter mt-4 text-xs text-ink-500" style={{ animationDelay: '0.35s' }}>
              {dict.hero.storesSoon}
            </p>

            <div
              className="hero-enter mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start"
              style={{ animationDelay: '0.4s' }}
            >
              {dict.hero.trustPoints.map((point) => (
                <span key={point} className="flex items-center gap-1.5 text-xs font-medium text-ink-500">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                  {point}
                </span>
              ))}
            </div>
          </div>

          {/* Media column */}
          <div className="hero-enter relative -mt-4 flex justify-center sm:-mt-8" style={{ animationDelay: '0.2s' }}>
            <div className="float-anim pointer-events-none absolute -right-2 top-6 hidden text-rose-300 opacity-70 sm:block">
              <RingsIcon className="h-9 w-9" />
            </div>
            <div
              className="float-anim pointer-events-none absolute -left-2 bottom-10 hidden text-blue-300 opacity-60 sm:block"
              style={{ animationDelay: '1.5s' }}
            >
              <HeartIcon className="h-7 w-7" />
            </div>
            <PhoneMockup />
          </div>
        </div>

        <div className="mt-14">
          <OrnamentDivider />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-16">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-bold text-blue-900">{dict.features.heading}</h2>
        </Reveal>
        <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dict.features.items.map(({ title, text }, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <Reveal key={title} delay={i * 90}>
                <div className="h-full rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-bold text-blue-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-bold text-blue-900">{dict.steps.heading}</h2>
          </Reveal>

          <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <span
              className="absolute top-5 right-[16.5%] left-[16.5%] hidden h-px bg-rose-200 sm:block"
              aria-hidden="true"
            />
            {dict.steps.items.map((step, i) => (
              <Reveal key={step.title} delay={i * 120} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center">
                  <StarSeal className="absolute inset-0 h-full w-full text-rose-100" />
                  <span
                    className="relative font-display text-lg font-extrabold text-rose-600"
                    style={{ fontVariantNumeric: 'lining-nums' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-blue-900">{step.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[22ch] text-sm leading-relaxed text-ink-500">{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / privacy strip */}
      <section id="trust" className="mx-auto w-full max-w-4xl scroll-mt-20 px-4 py-14">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-blue-900 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-right">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                <LockClosedIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-white">{dict.trustStrip.title}</h3>
                <p className="mt-1 text-sm text-blue-100">{dict.trustStrip.text}</p>
              </div>
            </div>
            <Link href={registerHref} className="w-full flex-shrink-0 sm:w-auto">
              <Button variant="rose" className="w-full sm:w-auto">
                {dict.trustStrip.cta}
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-16 pt-4 text-center">
        <Reveal>
          <h2 className="font-display mx-auto max-w-md text-2xl font-bold text-blue-900 sm:text-3xl">
            {dict.finalCta.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-ink-500 sm:text-base">{dict.finalCta.text}</p>
          <Link href={registerHref} className="mt-7 inline-block">
            <Button variant="rose" className="px-10 py-3.5 text-base shadow-lg shadow-rose-500/20">
              {dict.finalCta.button}
            </Button>
          </Link>
        </Reveal>
      </section>

      {/* Keyword / sitemap strip */}
      <section className="bg-blue-900 px-4 py-14">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-8 text-center">
          {dict.keywords.links.map((label, i) => {
            const kind = KEYWORD_HREF_KIND[i];
            const href = kind === 'register' ? registerHref : `#${kind}`;
            return (
              <a
                key={label}
                href={href}
                className="font-display text-xl font-bold text-blue-100 transition hover:text-rose-300 sm:text-2xl"
              >
                {label}
              </a>
            );
          })}
          {dict.keywords.soon.map((label) => (
            <span key={label} className="flex flex-col items-center gap-1.5">
              <span className="font-display text-xl font-bold text-blue-100/40 sm:text-2xl">{label}</span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-200">
                {dict.nav.soon}
              </span>
            </span>
          ))}
        </div>
      </section>

      <footer className="mt-auto flex flex-col items-center gap-4 border-t border-blue-100 px-4 py-10">
        <OrnamentDivider />
        <div className="flex items-center gap-2 text-xs text-ink-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" className="h-5 w-auto" />
          <span>{dict.footer.text}</span>
        </div>
      </footer>
    </main>
  );
}
