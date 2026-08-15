import seoLocationsRaw from '@/data/seoPages.json';

export const SITE_URL = 'https://9issmaonassib.com';

export const SUPPORTED_LOCALES = ['ar', 'fr', 'en', 'es'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ar';
export const RTL_LOCALES: readonly Locale[] = ['ar'];

const OG_LOCALE: Record<Locale, string> = { ar: 'ar_MA', fr: 'fr_FR', en: 'en_US', es: 'es_ES' };

const BRAND: Record<Locale, string> = {
  ar: 'قسمة و نصيب',
  fr: 'Qisma W Nasib',
  en: 'Qisma W Nasib',
  es: 'Qisma W Nasib',
};

export interface SeoLocaleTranslation {
  slug: string;
  displayName: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroText: string;
}

export interface SeoLocationEntry {
  id: string;
  type: 'city' | 'diaspora';
  /** Real DB query values — always Arabic, since that's how profile.currentCity/residenceCountry are stored, regardless of the page's display language. */
  targetCity: string | null;
  targetCountry: string;
  locales: Record<Locale, SeoLocaleTranslation>;
}

export const seoLocations = seoLocationsRaw as SeoLocationEntry[];

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function dirForLocale(locale: Locale): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

/** Prefixes an internal app path with a locale, e.g. "/feed" -> "/en/feed". Safe to call from server or client code. */
export function withLocale(locale: Locale, path: string): string {
  if (path.startsWith('http') || path.startsWith('#')) return path;
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}

export function brandNameFor(locale: Locale): string {
  return BRAND[locale];
}

export function ogLocaleFor(locale: Locale): string {
  return OG_LOCALE[locale];
}

export function findSeoPageBySlug(locale: Locale, slug: string) {
  for (const entry of seoLocations) {
    const translation = entry.locales[locale];
    if (translation?.slug === slug) return { entry, translation };
  }
  return undefined;
}

export function canonicalUrlFor(locale: Locale, translation: SeoLocaleTranslation): string {
  return `${SITE_URL}/${locale}/${translation.slug}`;
}

/** hreflang alternates for every locale of the same location, plus x-default pointing at Arabic. */
export function alternateLinksFor(entry: SeoLocationEntry): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of SUPPORTED_LOCALES) {
    languages[locale] = canonicalUrlFor(locale, entry.locales[locale]);
  }
  languages['x-default'] = canonicalUrlFor(DEFAULT_LOCALE, entry.locales[DEFAULT_LOCALE]);
  return languages;
}

export function buildJsonLd(locale: Locale, entry: SeoLocationEntry, translation: SeoLocaleTranslation) {
  const brand = brandNameFor(locale);
  const areaName =
    entry.type === 'city' ? `${translation.displayName}, Morocco` : translation.displayName;

  return {
    '@context': 'https://schema.org',
    '@type': ['Service', 'MatchmakingService'],
    name: `${brand} - ${translation.h1}`,
    serviceType: 'Islamic Matchmaking Service',
    description: translation.metaDescription,
    inLanguage: locale,
    provider: {
      '@type': 'Organization',
      name: brand,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
    },
    areaServed: { '@type': 'Place', name: areaName },
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 18 },
    offers: {
      '@type': 'Offer',
      name: 'Free VIP month on verified signup',
      price: '0',
      priceCurrency: 'MAD',
      url: `${SITE_URL}/register`,
    },
    url: canonicalUrlFor(locale, translation),
  };
}
