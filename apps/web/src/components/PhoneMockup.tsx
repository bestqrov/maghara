import { RingsIcon, ShieldCheckIcon, LockClosedIcon, HeartIcon } from '@/components/icons';

const MINI_FEATURES = [
  { icon: ShieldCheckIcon, label: 'ملفات موثّقة' },
  { icon: LockClosedIcon, label: 'خصوصية تامة' },
  { icon: HeartIcon, label: 'تعارف جادّ' },
];

/** A stylized preview of the real app UI — not a photo, an accurate mini rendering of our own screens. */
export function PhoneMockup({ className = '' }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-[240px] sm:w-[270px] ${className}`}>
      <div className="rounded-[2.6rem] border-[6px] border-blue-900 bg-blue-900 p-1.5 shadow-2xl shadow-blue-900/25">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-white">
          <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-blue-900" />

          <div className="flex flex-col gap-4 px-5 pb-6 pt-8">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <RingsIcon className="h-6 w-6 text-rose-500" />
              <span className="font-display text-sm font-bold text-blue-900">قسمة و نصيب</span>
            </div>

            <div className="mt-1 rounded-2xl bg-blue-50 p-3.5">
              <p className="text-center text-[11px] font-semibold text-blue-900">اختر ما يناسبك</p>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-blue-200 bg-white py-2.5 text-center">
                  <span className="text-[10px] font-semibold text-blue-700">أبحث عن زوج</span>
                </div>
                <div className="rounded-xl border-2 border-rose-400 bg-rose-50 py-2.5 text-center">
                  <span className="text-[10px] font-semibold text-rose-600">أبحث عن زوجة</span>
                </div>
              </div>
            </div>

            <div className="rounded-full bg-rose-500 py-2.5 text-center text-[11px] font-bold text-white">
              أنشئ حسابك الآن
            </div>

            <div className="mt-1 flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold text-blue-900/70">لماذا قسمة و نصيب؟</p>
              <div className="flex justify-between">
                {MINI_FEATURES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex w-[72px] flex-col items-center gap-1 text-center">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[9px] font-medium leading-tight text-ink-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
