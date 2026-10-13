'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { resetPassword } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { LocaleLink } from '@/components/LocaleLink';
import { useAppDict } from '@/hooks/useLocale';

function ResetPasswordForm() {
  const { dict } = useAppDict();
  const token = useSearchParams().get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [invalidLink, setInvalidLink] = useState(!token);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 8) return setError(dict.register.passwordMinLength);
    if (password !== confirm) return setError(dict.forgotPassword.passwordMismatch);

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) setInvalidLink(true);
      else setError(dict.common.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <p className="mt-6 rounded-xl bg-blue-50 p-4 text-center text-sm text-ink-700">{dict.forgotPassword.resetDone}</p>
        <p className="mt-6 text-center text-sm">
          <LocaleLink href="/login" className="font-semibold text-rose-600">
            {dict.forgotPassword.backToLogin}
          </LocaleLink>
        </p>
      </>
    );
  }

  if (invalidLink) {
    return (
      <>
        <p className="mt-6 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">{dict.forgotPassword.invalidLink}</p>
        <p className="mt-6 text-center text-sm">
          <LocaleLink href="/forgot-password" className="font-semibold text-rose-600">
            {dict.forgotPassword.requestNewLink}
          </LocaleLink>
        </p>
      </>
    );
  }

  return (
    <>
      <p className="mt-1 text-center text-sm text-ink-500">{dict.forgotPassword.resetSubtitle}</p>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          label={dict.forgotPassword.newPasswordLabel}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          id="confirm"
          type="password"
          required
          autoComplete="new-password"
          label={dict.forgotPassword.confirmPasswordLabel}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={loading} className="mt-2 w-full">
          {dict.forgotPassword.resetSubmit}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  const { dict } = useAppDict();

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
      style={{
        background: 'radial-gradient(60% 55% at 85% 0%, var(--color-rose-50) 0%, var(--background) 65%)',
      }}
    >
      <WeddingEmblem className="spin-anim pointer-events-none absolute right-1/2 top-1/3 h-[520px] w-[520px] -translate-y-1/2 translate-x-1/2 text-blue-700 opacity-[0.05] sm:h-[680px] sm:w-[680px]" />

      <div className="relative w-full max-w-sm rounded-3xl border border-blue-100 bg-surface p-8 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-icon.png" alt="" className="mx-auto h-14 w-auto" />
        <h1 className="font-display mt-4 text-center text-2xl font-bold text-blue-900">{dict.forgotPassword.resetTitle}</h1>
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
