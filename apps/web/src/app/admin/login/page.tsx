'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { isAxiosError } from 'axios';
import { useAdminStore } from '@/store/admin.store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminKey, hasHydrated, setAdminKey } = useAdminStore();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasHydrated && adminKey) router.replace('/admin');
  }, [hasHydrated, adminKey, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/promos/admin/list`, {
        headers: { 'x-admin-key': key },
      });
      setAdminKey(key);
      router.replace('/admin');
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        setError('مفتاح الإدارة غير صحيح');
      } else {
        setError('تعذّر الاتصال بالخادم، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!hasHydrated || adminKey) return null;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-blue-900 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-8 shadow-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-icon.png" alt="" className="mx-auto h-12 w-auto" />
        <h1 className="font-display mt-4 text-center text-xl font-bold text-blue-900">لوحة تحكم المشرف</h1>
        <p className="mt-1 text-center text-sm text-ink-500">أدخل مفتاح الإدارة للمتابعة</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            id="adminKey"
            label="مفتاح الإدارة"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            دخول
          </Button>
        </form>
      </div>
    </main>
  );
}
