'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import {
  getMyVerificationStatus,
  IdentityDocumentType,
  submitVerification,
  VerificationStatusResponse,
} from '@/services/verification.service';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ImageUploader } from '@/components/ImageUploader';
import { SelfieCamera } from '@/components/SelfieCamera';
import { ShieldCheckIcon } from '@/components/icons';
import { useAppDict, withLocale } from '@/hooks/useLocale';

export default function VerificationPage() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const { token, hasHydrated } = useAuthStore();
  const [status, setStatus] = useState<VerificationStatusResponse | null>(null);
  const [documentType, setDocumentType] = useState<IdentityDocumentType>('ID_CARD');
  const [idDocumentUrl, setIdDocumentUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
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
        documentType,
        idDocumentUrl,
        selfieUrl,
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
      <div className="w-full max-w-sm rounded-3xl bg-surface p-8 shadow-sm">
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
            {status?.verificationStatus === 'REJECTED' && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{dict.verification.rejected}</p>
            )}

            <ol className="flex flex-col gap-2 text-sm text-ink-700">
              {dict.verification.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <Select
              id="documentType"
              label={dict.verification.docTypeLabel}
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as IdentityDocumentType)}
              options={[
                { value: 'ID_CARD', label: dict.verification.idCard },
                { value: 'PASSPORT', label: dict.verification.passport },
              ]}
            />
            <ImageUploader
              label={dict.verification.idLabel}
              onUploaded={setIdDocumentUrl}
              folder="zawaj/verification"
              capture="environment"
            />
            <SelfieCamera label={dict.verification.selfieLabel} onUploaded={setSelfieUrl} folder="zawaj/verification" />
            <ImageUploader
              label={dict.verification.residencyLabel}
              onUploaded={setResidencyDocumentUrl}
              folder="zawaj/verification"
            />

            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <Button type="submit" loading={loading} disabled={!idDocumentUrl || !selfieUrl} className="mt-2 w-full">
              {dict.verification.submit}
            </Button>
            <p className="text-center text-xs text-ink-500">{dict.verification.privacy}</p>
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
