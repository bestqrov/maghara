'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import { ShieldCheckIcon, GlobeIcon, EyeIcon, ChatIcon, HeartIcon, LockClosedIcon } from '@/components/icons';

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: 'توثيق جدي',
    text: 'كل بروفايل موثق بالهوية أو الإقامة، وكيطلع لفوق فنتائج البحث — باش تعرف بلي كتهضر مع شخص حقيقي.',
  },
  {
    icon: GlobeIcon,
    title: 'زواج دولي والجالية',
    text: 'صفّي البحث بين المقيمين ديال الوطن وأبناء الجالية بالخارج، وحدد الاستعداد ديالك للانتقال.',
  },
  {
    icon: EyeIcon,
    title: 'شكون زارك',
    text: 'تبع آخر الزوار ديال البروفايل ديالك، وعرف شكون مهتم بيك قبل ما تبدا الخطوة الأولى.',
  },
  {
    icon: ChatIcon,
    title: 'شات آمن',
    text: 'ممنوع تبادل الأرقام أو روابط التواصل داخل الشات — الحوار كيبقى داخل التطبيق لحد التوافق.',
  },
];

const STEPS = [
  { n: '01', title: 'صاوب البروفايل', text: 'عمر بياناتك، حدد بلد الإقامة والأصل، وزيد صورة.' },
  { n: '02', title: 'بحث وتواصل', text: 'صفّي النتائج حسب المدينة والبلد، وابعث اهتمامك.' },
  { n: '03', title: 'توثق وتزوج', text: 'وثق هويتك، كمّل الحوار، وسجل الخطوبة عند التوافق.' },
];

export default function LandingPage() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && token) router.replace('/feed');
  }, [token, hasHydrated, router]);

  if (!hasHydrated || token) return null;

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="bg-emerald-50 px-4 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
          💍 منصة جادة للتعارف بقصد الزواج
        </span>
        <h1 className="mx-auto mt-6 max-w-2xl text-3xl font-bold leading-tight text-emerald-900 sm:text-5xl">
          الزواج الحلال يبدا بخطوة واحدة جادة
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base text-ink-500 sm:text-lg">
          تعارف موثق، بستر وأمان، خاص المقيمين ديال الوطن وأبناء الجالية فالخارج، بلا ما تضيع الوقت مع بروفايلات مزيفة.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register">
            <Button className="w-full px-8 py-3.5 text-base sm:w-auto">سجل مجانا دابا</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="w-full px-8 py-3.5 text-base sm:w-auto">
              عندي حساب، دخول
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink-500">بلا Stripe، بلا بطاقة بنكية إجبارية — دفع محلي وعملات رقمية</p>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-emerald-900">شنو كيميزنا</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-emerald-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-emerald-900">كيفاش خدام</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center sm:text-right">
                <span className="text-sm font-bold text-gold-600">{step.n}</span>
                <h3 className="mt-2 text-base font-bold text-emerald-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / privacy strip */}
      <section className="mx-auto w-full max-w-4xl px-4 py-14">
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-emerald-900 px-6 py-10 text-center text-white sm:flex-row sm:justify-between sm:text-right">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <LockClosedIcon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-bold">الستر والخصوصية أولا</h3>
              <p className="mt-1 text-sm text-emerald-100">
                الصور مغبشة لحد التوافق المتبادل، والشات محمي من تبادل معلومات الاتصال.
              </p>
            </div>
          </div>
          <Link href="/register" className="flex-shrink-0">
            <Button variant="gold" className="w-full sm:w-auto">
              ابدا رحلتك
            </Button>
          </Link>
        </div>
      </section>

      <footer className="mt-auto flex items-center justify-center gap-2 px-4 py-8 text-xs text-ink-500">
        <HeartIcon className="h-4 w-4 text-emerald-600" />
        <span>Zawaj — منصة التعارف بقصد الزواج الحلال</span>
      </footer>
    </main>
  );
}
