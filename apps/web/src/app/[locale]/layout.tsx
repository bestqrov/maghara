import { notFound } from 'next/navigation';
import { isSupportedLocale, dirForLocale, SUPPORTED_LOCALES } from '@/lib/seo';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

/**
 * The app's single <html> tag is owned by the true root layout (app/layout.tsx)
 * and stays lang="ar" dir="rtl" — Next.js only allows one layout to render
 * <html>, and that root is intentionally left untouched since it's also what
 * renders the unprefixed "/" marketing landing page. Every other screen (the
 * SEO pages and now the full authenticated app: /login, /feed, /chat, ...)
 * lives under this [locale] segment and gets dir/lang scoped to this wrapper
 * instead, which is fully valid HTML and correctly drives RTL/LTR styling and
 * screen-reader language per route.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const dir = dirForLocale(locale);

  return (
    <div lang={locale} dir={dir} className={`min-h-screen ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      {children}
    </div>
  );
}
