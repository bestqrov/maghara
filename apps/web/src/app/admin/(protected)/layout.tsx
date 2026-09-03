'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/admin.store';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { adminToken, hasHydrated } = useAdminStore();

  useEffect(() => {
    if (hasHydrated && !adminToken) router.replace('/admin/login');
  }, [hasHydrated, adminToken, router]);

  if (!hasHydrated || !adminToken) return null;

  return <>{children}</>;
}
