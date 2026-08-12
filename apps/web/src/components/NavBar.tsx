'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'البحث' },
  { href: '/visitors', label: 'الزوار' },
  { href: '/matches', label: 'الاهتمامات' },
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
    </nav>
  );
}
