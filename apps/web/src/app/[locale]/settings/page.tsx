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
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <NavBar />
      <h1 className="text-xl font-bold text-emerald-700">{dict.settings.title}</h1>

      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
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

      <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap">
        <PromoCodeInput />
        <ReferralShareCard />
      </div>
    </main>
  );
}
