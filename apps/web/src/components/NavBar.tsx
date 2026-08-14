'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GearIcon } from '@/components/icons';

const LINKS = [
  { href: '/feed', label: 'البحث' },
  { href: '/visitors', label: 'الزوار' },
  { href: '/matches', label: 'الاهتمامات' },
  { href: '/store', label: 'المتجر' },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 rounded-xl py-2 text-center text-sm font-semibold transition ${
              active ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href="/settings"
        aria-label="الإعدادات"
        className={`flex items-center justify-center rounded-xl px-3 transition ${
          pathname === '/settings' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
        }`}
      >
        <GearIcon className="h-4 w-4" />
      </Link>
    </nav>
  );
}
