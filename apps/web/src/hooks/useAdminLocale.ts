'use client';

import { useAdminLocaleStore } from '@/store/adminLocale.store';
import { adminDictionaries } from '@/dictionaries/admin';

export function useAdminDict() {
  const locale = useAdminLocaleStore((s) => s.locale);
  const setLocale = useAdminLocaleStore((s) => s.setLocale);
  return { locale, dict: adminDictionaries[locale], setLocale };
}
