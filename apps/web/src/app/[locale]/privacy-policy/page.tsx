import { notFound, redirect } from 'next/navigation';
import { dirForLocale, isSupportedLocale } from '@/lib/seo';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const TITLES: Record<string, string> = {
  ar: 'سياسة الخصوصية',
  fr: 'Politique de confidentialité',
  en: 'Privacy Policy',
  es: 'Política de privacidad',
};

const EMPTY: Record<string, string> = {
  ar: 'لم يتم إضافة سياسة الخصوصية بعد.',
  fr: "La politique de confidentialité n'a pas encore été ajoutée.",
  en: 'The privacy policy has not been added yet.',
  es: 'La política de privacidad aún no ha sido añadida.',
};

interface AppConfigResponse {
  privacyPolicy?: { url?: string; content?: string };
}

async function getPrivacyPolicy(): Promise<AppConfigResponse['privacyPolicy']> {
  try {
    const res = await fetch(`${API_URL}/app-config`, { next: { revalidate: 3600 } });
    if (!res.ok) return undefined;
    const data = (await res.json()) as AppConfigResponse;
    return data.privacyPolicy;
  } catch {
    return undefined;
  }
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();

  const policy = await getPrivacyPolicy();
  if (policy?.url) {
    redirect(policy.url);
  }

  return (
    <main dir={dirForLocale(locale)} className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-bold text-ink-900">{TITLES[locale]}</h1>
      <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-ink-700">
        {policy?.content || EMPTY[locale]}
      </div>
    </main>
  );
}
