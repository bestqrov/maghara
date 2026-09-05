import { notFound, redirect } from 'next/navigation';
import { dirForLocale, isSupportedLocale } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const TITLES: Record<string, string> = {
  ar: 'الشروط والأحكام',
  fr: 'Conditions générales',
  en: 'Terms & Conditions',
  es: 'Términos y condiciones',
};

const EMPTY: Record<string, string> = {
  ar: 'لم يتم إضافة الشروط والأحكام بعد.',
  fr: "Les conditions générales n'ont pas encore été ajoutées.",
  en: 'The terms and conditions have not been added yet.',
  es: 'Los términos y condiciones aún no han sido añadidos.',
};

interface AppConfigResponse {
  termsConditions?: { url?: string; content?: string };
}

async function getTerms(): Promise<AppConfigResponse['termsConditions']> {
  try {
    const res = await fetch(`${API_URL}/app-config`, { next: { revalidate: 3600 } });
    if (!res.ok) return undefined;
    const data = (await res.json()) as AppConfigResponse;
    return data.termsConditions;
  } catch {
    return undefined;
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const terms = await getTerms();
  if (terms?.url) {
    redirect(terms.url);
  }

  return (
    <main dir={dirForLocale(locale)} className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold text-ink-900">{TITLES[locale]}</h1>
      <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-ink-700">
        {terms?.content || EMPTY[locale]}
      </div>
    </main>
  );
}
