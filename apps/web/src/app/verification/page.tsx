'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, submitVerification, VerificationStatusResponse } from '@/services/verification.service';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { ShieldCheckIcon } from '@/components/icons';

export default function VerificationPage() {
  const router = useRouter();
  const { token, hasHydrated } = useAuthStore();
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [residencyDocumentUrl, setResidencyDocumentUrl] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace('/login');
      return;
    }
    getMyVerificationStatus().then(setStatus).catch(() => setStatus(null));
  }, [token, hasHydrated, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setLoading(true);
    try {
      await submitVerification({
        idDocumentUrl,
        residencyDocumentUrl: residencyDocumentUrl || undefined,
      });
      const updated = await getMyVerificationStatus();
      setStatus(updated);
    } catch (err) {
      if (isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? 'كاين مشكل، حاول مرة أخرى');
      } else {
        setServerError('كاين مشكل، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  const alreadySubmitted = status?.verificationStatus === 'PENDING' || status?.verificationStatus === 'VERIFIED';

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-emerald-50 px-4 py-10">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-600">
          <ShieldCheckIcon className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-emerald-700">وثّق حسابك مجاناً</h1>
        <p className="mt-1 text-center text-sm text-ink-500">
          صيفط CIN أو Passport للحصول على شارة &quot;عضو جاد وموثق&quot; وزد فرصك فـ الظهور
        </p>

        {alreadySubmitted ? (
          <div className="mt-8 rounded-xl bg-emerald-50 p-4 text-center text-sm text-emerald-700">
            {status?.verificationStatus === 'VERIFIED'
              ? 'حسابك موثق بالفعل ✓'
              : 'طلب التوثيق ديالك قيد المراجعة، غادي نعلموك بالنتيجة قريباً'}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <ImageUploader label="صورة CIN / Passport" onUploaded={setIdDocumentUrl} folder="zawaj/verification" />
            <ImageUploader
              label="وثيقة الإقامة بالخارج (اختياري)"
              onUploaded={setResidencyDocumentUrl}
              folder="zawaj/verification"
            />

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <Button type="submit" loading={loading} disabled={!idDocumentUrl} className="mt-2 w-full">
              صيفط للمراجعة
            </Button>
          </form>
        )}

        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-6 w-full text-center text-sm font-semibold text-ink-500 underline"
        >
          تخطى دابا، نوثق من بعد
        </button>
      </div>
    </main>
  );
}
