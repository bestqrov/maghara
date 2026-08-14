import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const MENU_LINKS = [
  { href: '#features', label: 'مميزاتنا' },
  { href: '#how', label: 'كيف تعمل المنصة' },
  { href: '#trust', label: 'الخصوصية والأمان' },
];

export function LandingHeader() {
  return (
    <div className="sticky top-0 z-30 border-b border-blue-100/70 bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="font-display flex items-center gap-2 text-lg font-bold text-blue-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="" className="h-10 w-auto" />
          قسمة و نصيب
        </span>

        <nav className="hidden items-center gap-7 md:flex" aria-label="التنقل الرئيسي">
          {MENU_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-blue-700/80 transition hover:text-blue-900"
            >
              {link.label}
            </a>
          ))}
          <span className="flex items-center gap-1.5 text-sm font-medium text-blue-700/40">
            قصص نجاح
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-400">قريبًا</span>
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm font-semibold text-blue-700 hover:text-blue-900 sm:block">
            تسجيل الدخول
          </Link>
          <Link href="/register">
            <Button variant="rose" className="px-5 py-2 text-sm">
              سجّل الآن
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
