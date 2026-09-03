'use client';

import { useEffect } from 'react';
import { useAdminLocaleStore } from '@/store/adminLocale.store';

/** Syncs <html lang/dir> to the admin locale while any /admin route is mounted, restoring the site default on unmount. */
export function AdminHtmlDirSync() {
  const locale = useAdminLocaleStore((s) => s.locale);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = locale === 'ar' ? 'rtl' : 'ltr';
    return () => {
      html.lang = 'ar';
      html.dir = 'rtl';
    };
  }, [locale]);

  return null;
}
