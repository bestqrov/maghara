import type { MetadataRoute } from 'next';
import { SITE_URL, seoLocations, SUPPORTED_LOCALES, canonicalUrlFor, alternateLinksFor } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const seoEntries: MetadataRoute.Sitemap = seoLocations.flatMap((entry) => {
    const languages = alternateLinksFor(entry);
    return SUPPORTED_LOCALES.map((locale) => ({
      url: canonicalUrlFor(locale, entry.locales[locale]),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: { languages },
    }));
  });

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...seoEntries,
  ];
}
