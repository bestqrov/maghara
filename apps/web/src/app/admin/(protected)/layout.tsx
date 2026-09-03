'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin.store';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { adminKey, hasHydrated } = useAdminStore();

  useEffect(() => {
    if (hasHydrated && !adminKey) router.replace('/admin/login');
  }, [hasHydrated, adminKey, router]);

  if (!hasHydrated || !adminKey) return null;

  return <>{children}</>;
}
