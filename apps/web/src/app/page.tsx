'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheckIcon,
  GlobeIcon,
  EyeIcon,
  ChatIcon,
  HeartIcon,
  LockClosedIcon,
  RingsIcon,
} from '@/components/icons';

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    title: 'توثيقٌ جادّ',
    text: 'كل ملفٍ تعريفي موثَّق بالهوية أو الإقامة يظهر أولًا في نتائج البحث، لتطمئن أنك تتحدث إلى شخصٍ حقيقي.',
  },
  {
    icon: GlobeIcon,
    title: 'الزواج الدولي والجالية',
    text: 'صفِّ نتائج البحث بين المقيمين في الوطن وأبناء الجالية في الخارج، وحدِّد استعدادك للانتقال.',
  },
  {
    icon: EyeIcon,
    title: 'مَن زار ملفّك؟',
    text: 'تابع آخر الزوّار الذين اطّلعوا على ملفك التعريفي، واكتشف مَن أبدى اهتمامه بك.',
  },
  {
    icon: ChatIcon,
    title: 'محادثةٌ آمنة',
    text: 'لا يُسمح بتبادل الأرقام أو روابط التواصل داخل المحادثة، فيبقى الحوار محفوظًا داخل المنصة حتى يتم التوافق.',
  },
];

const STEPS = [
  { n: '٠١', title: 'أنشئ ملفّك التعريفي', text: 'أكمل بياناتك، وحدِّد بلد إقامتك وأصلك، وأضِف صورتك.' },
  { n: '٠٢', title: 'ابحث وتواصل', text: 'صفِّ النتائج حسب المدينة والبلد، وابعث اهتمامك لمن يعجبك.' },
  { n: '٠٣', title: 'وثِّق وتزوَّج', text: 'وثِّق هويتك، أكمِل الحوار، وسجِّل الخطوبة عند حصول التوافق.' },
];

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden="true">
      <span className="h-px w-14 bg-gold-300 sm:w-20" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold-500" />
      <span className="h-px w-14 bg-gold-300 sm:w-20" />
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && token) router.replace('/feed');
  }, [token, hasHydrated, router]);

  if (!hasHydrated || token) return null;

  return (
    <main className="flex min-h-screen flex-col font-arabic">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pb-14 pt-24 text-center"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 0%, var(--color-rose-50) 0%, var(--background) 70%)',
        }}
      >
        <RingsIcon className="mx-auto h-9 w-9 text-gold-500" />

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold-300 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-600">
          منصة إلكترونية للتعارف بقصد الزواج الحلال
        </span>

        <h1 className="font-display mx-auto mt-7 max-w-2xl text-4xl font-bold leading-[1.3] text-emerald-900 sm:text-6xl">
          الزواج الحلالُ يبدأ بخطوةٍ جادّة
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-500 sm:text-lg">
          منصةُ تعارفٍ موثوقة تجمع المقيمين في الوطن وأبناء الجالية في الخارج، بستْرٍ وأمان، بعيدًا عن الحسابات
          الوهمية.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/register">
            <Button variant="gold" className="w-full px-9 py-3.5 text-base sm:w-auto">
              أنشئ حسابك الآن
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="w-full px-9 py-3.5 text-base sm:w-auto">
              لديّ حساب، تسجيل الدخول
            </Button>
          </Link>
        </div>
        <p className="mt-5 text-xs text-ink-500">
          دون الحاجة إلى بطاقةٍ بنكية إلزامية — دفعٌ محلي وعملاتٌ رقمية آمنة
        </p>

        <div className="mt-14">
          <OrnamentDivider />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16">
        <h2 className="font-display text-center text-3xl font-bold text-emerald-900">ما الذي يميّزنا؟</h2>
        <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-gold-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display mt-4 text-lg font-bold text-emerald-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-center text-3xl font-bold text-emerald-900">كيف تسير الرحلة؟</h2>

          <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <span
              className="absolute top-5 right-[16.5%] left-[16.5%] hidden h-px bg-gold-200 sm:block"
              aria-hidden="true"
            />
            {STEPS.map((step) => (
              <div key={step.n} className="relative text-center">
                <span className="relative z-10 mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-gold-300 bg-white font-display text-sm font-bold text-gold-600">
                  {step.n}
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-emerald-900">{step.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[22ch] text-sm leading-relaxed text-ink-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / privacy strip */}
      <section className="mx-auto w-full max-w-4xl px-4 py-14">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-emerald-900 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-right">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10 text-gold-300">
              <LockClosedIcon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-white">الستْر والخصوصية أولًا</h3>
              <p className="mt-1 text-sm text-emerald-100">
                الصور محجوبة حتى يتحقّق التوافق المتبادل، والمحادثة محمية من تبادل معلومات الاتصال.
              </p>
            </div>
          </div>
          <Link href="/register" className="w-full flex-shrink-0 sm:w-auto">
            <Button variant="gold" className="w-full sm:w-auto">
              ابدأ رحلتك
            </Button>
          </Link>
        </div>
      </section>

      <footer className="mt-auto flex flex-col items-center gap-4 px-4 py-10">
        <OrnamentDivider />
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <HeartIcon className="h-4 w-4 text-emerald-600" />
          <span>Zawaj — منصةٌ للتعارف بقصد الزواج الحلال</span>
        </div>
      </footer>
    </main>
  );
}
