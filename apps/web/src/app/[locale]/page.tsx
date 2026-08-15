import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isSupportedLocale, ogLocaleFor, SITE_URL, type Locale } from '@/lib/seo';
import { LANDING_DICTIONARY } from '@/dictionaries/landing';
import { LocaleLandingContent } from '@/components/landing/LocaleLandingContent';

// Arabic already lives at the bare "/" (untouched root landing page) and
// bare "/ar" 308-redirects there (next.config.ts) — so this route only
// needs to exist for the translated locales.
const TRANSLATED_LOCALES: Locale[] = ['fr', 'en', 'es'];

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return TRANSLATED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale) || !TRANSLATED_LOCALES.includes(locale)) return {};

  const dict = LANDING_DICTIONARY[locale];
  const title = `${dict.hero.h1Main} ${dict.hero.h1Accent} — Qisma W Nasib`;
  const description = dict.hero.text;
  const canonical = `${SITE_URL}/${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ar: SITE_URL,
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
        'x-default': SITE_URL,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Qisma W Nasib',
      locale: ogLocaleFor(locale),
      type: 'website',
      images: [`${SITE_URL}/logo.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/logo.png`],
    },
  };
}

export default async function LocaleLandingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale) || !TRANSLATED_LOCALES.includes(locale)) notFound();

  return <LocaleLandingContent locale={locale} />;
}
