import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  findSeoPageBySlug,
  seoLocations,
  alternateLinksFor,
  canonicalUrlFor,
  buildJsonLd,
  ogLocaleFor,
  isSupportedLocale,
  SITE_URL,
  SUPPORTED_LOCALES,
  type Locale,
} from '@/lib/seo';
import { SEO_DICTIONARY } from '@/lib/seoDictionary';
import { getPublicPreviewProfiles } from '@/services/public.service';
import { SeoLandingContent } from '@/components/seo/SeoLandingContent';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return seoLocations.flatMap((entry) =>
    SUPPORTED_LOCALES.map((locale) => ({ locale, slug: entry.locales[locale].slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) return {};

  const found = findSeoPageBySlug(locale, slug);
  if (!found) return {};
  const { entry, translation } = found;

  const canonical = canonicalUrlFor(locale, translation);

  return {
    title: translation.metaTitle,
    description: translation.metaDescription,
    alternates: {
      canonical,
      languages: alternateLinksFor(entry),
    },
    openGraph: {
      title: translation.metaTitle,
      description: translation.metaDescription,
      url: canonical,
      siteName: 'Qisma W Nasib',
      locale: ogLocaleFor(locale),
      type: 'website',
      images: [`${SITE_URL}/logo.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: translation.metaTitle,
      description: translation.metaDescription,
      images: [`${SITE_URL}/logo.png`],
    },
  };
}

export default async function SeoLocaleLandingPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const found = findSeoPageBySlug(locale, slug);
  if (!found) notFound();
  const { entry, translation } = found;

  const [profiles] = await Promise.all([
    getPublicPreviewProfiles({ city: entry.targetCity, country: entry.targetCountry, limit: 8 }),
  ]);

  const schema = buildJsonLd(locale, entry, translation);

  const hrefByLocale = SUPPORTED_LOCALES.reduce(
    (acc, l) => {
      acc[l] = `/${l}/${entry.locales[l].slug}`;
      return acc;
    },
    {} as Record<Locale, string>,
  );

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SeoLandingContent
        locale={locale}
        entry={entry}
        translation={translation}
        dict={SEO_DICTIONARY[locale]}
        hrefByLocale={hrefByLocale}
        profiles={profiles}
      />
    </>
  );
}
