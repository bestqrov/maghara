'use client';

import { usePathname, useRouter } from 'next/navigation';
import { GearIcon, LogoutIcon, UserIcon } from '@/components/icons';
import { LocaleLink } from '@/components/LocaleLink';
import { LanguageSelector } from '@/components/seo/LanguageSelector';
import { useAuthStore } from '@/store/auth.store';
import { useAppDict, withLocale } from '@/hooks/useLocale';
import { SUPPORTED_LOCALES, type Locale } from '@/lib/seo';

export function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const logout = useAuthStore((s) => s.logout);

  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), '') || '/';
  const hrefByLocale = SUPPORTED_LOCALES.reduce(
    (acc, l) => {
      acc[l] = withLocale(l, pathWithoutLocale);
      return acc;
    },
    {} as Record<Locale, string>,
  );

  const LINKS = [
    { href: '/feed', label: dict.nav.search },
    { href: '/visitors', label: dict.nav.visitors },
    { href: '/matches', label: dict.nav.matches },
    { href: '/store', label: dict.nav.store },
  ];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white p-1.5 shadow-sm">
      <LocaleLink
        href="/feed"
        className="font-display flex items-center gap-1.5 pr-1 pl-2 text-sm font-bold text-blue-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-icon.png" alt="" className="h-7 w-auto" />
        <span className="hidden sm:inline">{dict.common.brand}</span>
      </LocaleLink>
      <nav className="flex flex-1 gap-2">
        {LINKS.map((link) => {
          const active = pathname === withLocale(locale, link.href);
          return (
            <LocaleLink
              key={link.href}
              href={link.href}
              className={`flex-1 rounded-xl py-2 text-center text-sm font-semibold transition ${
                active ? 'bg-rose-500 text-white' : 'text-blue-700 hover:bg-rose-50'
              }`}
            >
              {link.label}
            </LocaleLink>
          );
        })}
        <LocaleLink
          href="/profile"
          aria-label={dict.nav.profileAria}
          className={`flex items-center justify-center rounded-xl px-3 transition ${
            pathname === withLocale(locale, '/profile') ? 'bg-rose-500 text-white' : 'text-blue-700 hover:bg-rose-50'
          }`}
        >
          <UserIcon className="h-4 w-4" />
        </LocaleLink>
        <LocaleLink
          href="/settings"
          aria-label={dict.nav.settingsAria}
          className={`flex items-center justify-center rounded-xl px-3 transition ${
            pathname === withLocale(locale, '/settings') ? 'bg-rose-500 text-white' : 'text-blue-700 hover:bg-rose-50'
          }`}
        >
          <GearIcon className="h-4 w-4" />
        </LocaleLink>
        <button
          type="button"
          aria-label={dict.nav.logoutAria}
          onClick={() => {
            logout();
            router.push(withLocale(locale, '/login'));
          }}
          className="flex items-center justify-center rounded-xl px-3 text-blue-700 transition hover:bg-rose-50"
        >
          <LogoutIcon className="h-4 w-4" />
        </button>
      </nav>
      <LanguageSelector currentLocale={locale} hrefByLocale={hrefByLocale} label={dict.languageSelector.label} />
    </div>
  );
}
