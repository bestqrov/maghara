'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { getMyVerificationStatus, VerificationStatusResponse } from '@/services/verification.service';
import { VerificationBanner } from '@/components/VerificationBanner';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { token, user, logout } = useAuthStore();
  const [verification, setVerification] = useState<VerificationStatusResponse | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    getMyVerificationStatus().then(setVerification).catch(() => setVerification(null));
  }, [token, router]);

  if (!token || !user) return null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-emerald-700">أهلاً {user.profile.firstName} 👋</h1>
          <p className="text-sm text-ink-500">{user.profile.currentCity} · {user.profile.residenceCountry}</p>
        </div>
        <Button variant="ghost" onClick={() => { logout(); router.push('/login'); }}>
          خروج
        </Button>
      </header>

      {verification && <VerificationBanner status={verification.verificationStatus} />}

      <section className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-white/50 p-10 text-center text-ink-500">
        <p className="text-lg font-semibold text-emerald-700">Feed / Search screen</p>
        <p className="mt-2 text-sm">
          هادي المرحلة الجاية: البحث، الزوار (المصيدة)، والشات — Auth &amp; Onboarding خدامين دابا.
        </p>
      </section>
    </main>
  );
}
