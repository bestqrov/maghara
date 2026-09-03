'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema, LoginInput } from '@/utils/validation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { LocaleLink } from '@/components/LocaleLink';
import { useAppDict, withLocale } from '@/hooks/useLocale';

export default function LoginPage() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const setSession = useAuthStore((s) => s.setSession);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    setLoading(true);
    try {
      const { accessToken, user } = await login(values);
      setSession(accessToken, user);
      router.push(withLocale(locale, '/feed'));
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setServerError(dict.login.errorInvalid);
      } else {
        setServerError(dict.common.errorGeneric);
      }
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
        <h1 className="font-display mt-4 text-center text-2xl font-bold text-blue-900">{dict.login.title}</h1>
        <p className="mt-1 text-center text-sm text-ink-500">{dict.login.subtitle}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <Input
            id="phoneNumber"
            label={dict.login.phoneLabel}
            placeholder={dict.login.phonePlaceholder}
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />
          <Input
            id="password"
            label={dict.login.passwordLabel}
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" loading={loading} className="mt-2 w-full">
            {dict.login.submit}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {dict.login.noAccount}{' '}
          <LocaleLink href="/register" className="font-semibold text-rose-600">
            {dict.login.registerLink}
          </LocaleLink>
        </p>
      </div>
    </main>
  );
}
