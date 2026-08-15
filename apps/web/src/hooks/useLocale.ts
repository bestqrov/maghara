'use client';

import { useParams } from 'next/navigation';
import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from '@/lib/seo';
import { appDictionaries } from '@/dictionaries/app';

export { withLocale } from '@/lib/seo';

/** Current locale from the /[locale] route segment. Falls back to Arabic outside of it (shouldn't happen once every app route lives under [locale]). */
export function useLocale(): Locale {
  const params = useParams<{ locale?: string }>();
  const raw = params?.locale;
  return raw && isSupportedLocale(raw) ? raw : DEFAULT_LOCALE;
}

export function useAppDict() {
  const locale = useLocale();
  return { locale, dict: appDictionaries[locale] };
}
