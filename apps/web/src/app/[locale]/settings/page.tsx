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
import { LockClosedIcon } from '@/components/icons';
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

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
        <NavBar />

        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-surface/90 p-5 shadow-sm backdrop-blur-sm sm:p-8">
          <WeddingEmblem className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-rose-500 opacity-[0.06] sm:h-56 sm:w-56" />

          <div className="relative flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" className="h-10 w-auto" />
            <h1 className="font-display text-xl font-bold text-blue-900">{dict.settings.title}</h1>
          </div>

          <div className="relative mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="h-full rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <LockClosedIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display font-bold text-blue-900">{dict.settings.changePasswordTitle}</h2>
                  <p className="text-xs text-ink-500">{dict.settings.changePasswordSubtitle}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3">
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

                <Button type="submit" loading={loading} className="mt-1 w-full">
                  {dict.settings.save}
                </Button>
              </form>
            </div>

            <PromoCodeInput />
          </div>

          <div className="relative mt-4">
            <ReferralShareCard />
          </div>
        </div>
      </div>
    </main>
  );
}
