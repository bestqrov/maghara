'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema, LoginInput } from '@/utils/validation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
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
      router.push('/feed');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setServerError('رقم الهاتف أو الپاسوورد غير صحيحين');
      } else {
        setServerError('كاين مشكل، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-emerald-50 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-emerald-700">مرحباً بك من جديد</h1>
        <p className="mt-1 text-center text-sm text-ink-500">دخل لحسابك وكمّل رحلتك نحو الزواج</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
          <Input
            id="phoneNumber"
            label="رقم الهاتف"
            placeholder="+212600000000"
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />
          <Input
            id="password"
            label="الپاسوورد"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" loading={loading} className="mt-2 w-full">
            دخول
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          ماعندكش حساب؟{' '}
          <Link href="/register" className="font-semibold text-emerald-600">
            سجل دابا
          </Link>
        </p>
      </div>
    </main>
  );
}
