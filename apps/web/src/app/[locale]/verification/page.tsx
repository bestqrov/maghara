'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, submitVerification, VerificationStatusResponse } from '@/services/verification.service';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/ImageUploader';
import { ShieldCheckIcon } from '@/components/icons';
import { useAppDict, withLocale } from '@/hooks/useLocale';

export default function VerificationPage() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const { token, hasHydrated } = useAuthStore();
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [residencyDocumentUrl, setResidencyDocumentUrl] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace(withLocale(locale, '/login'));
      return;
    }
    getMyVerificationStatus().then(setStatus).catch(() => setStatus(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setServerError(err.response?.data?.message ?? dict.common.errorGeneric);
      } else {
        setServerError(dict.common.errorGeneric);
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
        <h1 className="mt-4 text-center text-2xl font-bold text-emerald-700">{dict.verification.title}</h1>
        <p className="mt-1 text-center text-sm text-ink-500">{dict.verification.subtitle}</p>

        {alreadySubmitted ? (
          <div className="mt-8 rounded-xl bg-emerald-50 p-4 text-center text-sm text-emerald-700">
            {status?.verificationStatus === 'VERIFIED' ? dict.verification.alreadyVerified : dict.verification.alreadyPending}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
            <ImageUploader label={dict.verification.idLabel} onUploaded={setIdDocumentUrl} folder="zawaj/verification" />
            <ImageUploader
              label={dict.verification.residencyLabel}
              onUploaded={setResidencyDocumentUrl}
              folder="zawaj/verification"
            />

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <Button type="submit" loading={loading} disabled={!idDocumentUrl} className="mt-2 w-full">
              {dict.verification.submit}
            </Button>
          </form>
        )}

        <button
          type="button"
          onClick={() => router.push(withLocale(locale, '/feed'))}
          className="mt-6 w-full text-center text-sm font-semibold text-ink-500 underline"
        >
          {dict.verification.skip}
        </button>
      </div>
    </main>
  );
}
