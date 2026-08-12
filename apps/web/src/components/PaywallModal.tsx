import { Button } from './ui/Button';
import { UNLOCK_COIN_COST } from '@/services/chat.service';

interface PaywallModalProps {
  onUnlockWithCoins: () => void;
  onUpgradeVip: () => void;
  onClose: () => void;
  loading: boolean;
}

export function PaywallModal({ onUnlockWithCoins, onUpgradeVip, onClose, loading }: PaywallModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-900/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-2xl">💬</div>
        <h2 className="mt-4 text-lg font-bold text-emerald-700">وصلتي لمرحلة مهمة!</h2>
        <p className="mt-2 text-sm text-ink-500">
          باش تكمل الشات بسلاسة، فتحو بـ {UNLOCK_COIN_COST} نقط أو ترقى لـ VIP للشات بلا حدود
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="gold" onClick={onUpgradeVip} disabled={loading}>
            ترقى لـ VIP
          </Button>
          <Button onClick={onUnlockWithCoins} loading={loading}>
            فتح بـ {UNLOCK_COIN_COST} نقط
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}
