'use client';

import { useAdminDict } from '@/hooks/useAdminLocale';

export function AdminLocaleToggle() {
  const { locale, setLocale } = useAdminDict();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
      className="rounded-full border border-blue-100 bg-surface px-3 py-1.5 text-xs font-semibold text-blue-900 transition hover:bg-blue-50"
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}
