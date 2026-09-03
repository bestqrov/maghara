'use client';

import { Button } from './ui/Button';
import { UNLOCK_COIN_COST } from '@/services/chat.service';
import { useAppDict } from '@/hooks/useLocale';

interface PaywallModalProps {
  onUnlockWithCoins: () => void;
  onUpgradeVip: () => void;
  onClose: () => void;
  loading: boolean;
}

export function PaywallModal({ onUnlockWithCoins, onUpgradeVip, onClose, loading }: PaywallModalProps) {
  const { dict } = useAppDict();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-900/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-2xl">💬</div>
        <h2 className="mt-4 text-lg font-bold text-emerald-700">{dict.paywallModal.title}</h2>
        <p className="mt-2 text-sm text-ink-500">{dict.paywallModal.body(UNLOCK_COIN_COST)}</p>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="gold" onClick={onUpgradeVip} disabled={loading}>
            {dict.paywallModal.upgradeVip}
          </Button>
          <Button onClick={onUnlockWithCoins} loading={loading}>
            {dict.paywallModal.unlockWithCoins(UNLOCK_COIN_COST)}
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {dict.paywallModal.close}
          </Button>
        </div>
      </div>
    </div>
  );
}
