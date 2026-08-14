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

export default function SettingsPage() {
  const router = useRouter();
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
    if (hasHydrated && !token) router.replace('/login');
  }, [token, hasHydrated, router]);

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
        setServerError('الپاسوورد الحالي غير صحيح');
      } else {
        setServerError('كاين مشكل، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!hasHydrated || !token) return null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-8">
      <NavBar />
      <h1 className="text-xl font-bold text-emerald-700">الإعدادات</h1>

      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-lg font-bold text-emerald-700">بدّل الپاسوورد</h2>
        <p className="mt-1 text-sm text-ink-500">دخل الپاسوورد الحالي، وحدد وحدة جديدة</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <Input
            id="currentPassword"
            label="الپاسوورد الحالي"
            type="password"
            {...register('currentPassword')}
            error={errors.currentPassword?.message}
          />
          <Input
            id="newPassword"
            label="الپاسوورد الجديد"
            type="password"
            {...register('newPassword')}
            error={errors.newPassword?.message}
          />
          <Input
            id="confirmPassword"
            label="أكد الپاسوورد الجديد"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}
          {success && <p className="text-sm text-emerald-600">تبدل الپاسوورد بنجاح</p>}

          <Button type="submit" loading={loading} className="mt-2 w-full">
            حفظ
          </Button>
        </form>
      </div>
    </main>
  );
}
