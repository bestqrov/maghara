'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { changePassword } from '@/services/users.service';
import { changePasswordSchema, ChangePasswordInput } from '@/utils/validation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { NavBar } from '@/components/NavBar';
import { WeddingEmblem } from '@/components/WeddingEmblem';
import { PromoCodeInput } from '@/components/PromoCodeInput';
import { ReferralShareCard } from '@/components/ReferralShareCard';
import { useAppDict, withLocale } from '@/hooks/useLocale';

export default function SettingsPage() {
  const router = useRouter();
  const { locale, dict } = useAppDict();
  const { token, hasHydrated } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  useEffect(() => {
    if (hasHydrated && !token) router.replace(withLocale(locale, '/login'));
  }, [token, hasHydrated, router, locale]);

  async function onSubmit(values: ChangePasswordInput) {
    setServerError(null);
    setSuccess(false);
    setLoading(true);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setSuccess(true);
      reset();
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setServerError(dict.settings.errorWrongPassword);
      } else {
        setServerError(dict.common.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!hasHydrated || !token) return null;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(60% 40% at 85% 0%, var(--color-rose-50) 0%, var(--background) 65%)',
      }}
    >
      <WeddingEmblem className="spin-anim pointer-events-none absolute right-1/2 top-0 h-[520px] w-[520px] -translate-y-1/3 translate-x-1/2 text-blue-700 opacity-[0.05] sm:h-[680px] sm:w-[680px]" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
        <NavBar />

        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-surface/90 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <WeddingEmblem className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-rose-500 opacity-[0.06] sm:h-56 sm:w-56" />

          <div className="relative flex flex-col items-center gap-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" className="h-12 w-auto" />
            <h1 className="font-display text-2xl font-bold text-blue-900">{dict.settings.title}</h1>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-sm">
            <h2 className="text-lg font-bold text-emerald-700">{dict.settings.changePasswordTitle}</h2>
            <p className="mt-1 text-sm text-ink-500">{dict.settings.changePasswordSubtitle}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
              <Input
                id="currentPassword"
                label={dict.settings.currentPasswordLabel}
                type="password"
                {...register('currentPassword')}
                error={errors.currentPassword?.message}
              />
              <Input
                id="newPassword"
                label={dict.settings.newPasswordLabel}
                type="password"
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              <Input
                id="confirmPassword"
                label={dict.settings.confirmPasswordLabel}
                type="password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}
              {success && <p className="text-sm text-emerald-600">{dict.settings.success}</p>}

              <Button type="submit" loading={loading} className="mt-2 w-full">
                {dict.settings.save}
              </Button>
            </form>
          </div>

          <div className="relative mt-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:justify-center">
            <PromoCodeInput />
            <ReferralShareCard />
          </div>
        </div>
      </div>
    </main>
  );
}
