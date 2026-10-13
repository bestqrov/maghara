'use client';

import { FormEvent, useState } from 'react';
import { requestPasswordReset } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { LocaleLink } from '@/components/LocaleLink';
import { useAppDict } from '@/hooks/useLocale';

export default function ForgotPasswordPage() {
  const { locale, dict } = useAppDict();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setServerError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email.trim(), locale);
      setSent(true);
    } catch {
      setServerError(dict.common.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

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
        <h1 className="font-display mt-4 text-center text-2xl font-bold text-blue-900">{dict.forgotPassword.title}</h1>

        {sent ? (
          <p className="mt-6 rounded-xl bg-blue-50 p-4 text-center text-sm text-ink-700">{dict.forgotPassword.sent}</p>
        ) : (
          <>
            <p className="mt-1 text-center text-sm text-ink-500">{dict.forgotPassword.subtitle}</p>
            <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
              <Input
                id="email"
                type="email"
                required
                label={dict.forgotPassword.emailLabel}
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}

              <Button type="submit" loading={loading} className="mt-2 w-full">
                {dict.forgotPassword.submit}
              </Button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <LocaleLink href="/login" className="font-semibold text-rose-600">
            {dict.forgotPassword.backToLogin}
          </LocaleLink>
        </p>
      </div>
    </main>
  );
}
