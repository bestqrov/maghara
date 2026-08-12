import Link from 'next/link';
import { ShieldCheckIcon } from './icons';

const COPY: Record<string, { title: string; subtitle: string; tone: string }> = {
  UNVERIFIED: {
    title: 'وثّق حسابك مجاناً',
    subtitle: 'احصل على شارة "عضو جاد وموثق" وزد فرصك فـ الظهور فـ البحث',
    tone: 'bg-gold-100 text-emerald-900',
  },
  PENDING: {
    title: 'التوثيق قيد المراجعة',
    subtitle: 'غادي نراجعو الوثائق ديالك ونعلموك بالنتيجة قريباً',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  REJECTED: {
    title: 'التوثيق تم رفضه',
    subtitle: 'حاول تصيفط وثيقة أوضح، أو تواصل مع الدعم',
    tone: 'bg-rose-100 text-rose-700',
  },
};

export function VerificationBanner({ status }: { status: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' }) {
  if (status === 'VERIFIED') return null;
  const copy = COPY[status];

  return (
    <div className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 ${copy.tone}`}>
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-6 w-6 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{copy.title}</p>
          <p className="text-xs opacity-80">{copy.subtitle}</p>
        </div>
      </div>
      {status !== 'PENDING' && (
        <Link href="/verification" className="whitespace-nowrap text-xs font-semibold underline">
          وثّق دابا
        </Link>
      )}
    </div>
  );
}
