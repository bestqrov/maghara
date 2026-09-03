'use client';

import { useState } from 'react';
import { isAxiosError } from 'axios';
import { redeemPromoCode, RedeemPromoResponse } from '@/services/promos.service';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { GiftIcon, ShieldCheckIcon } from './icons';
import { useAppDict } from '@/hooks/useLocale';
import type { AppDictionary } from '@/dictionaries/app';

function rewardLabel(dict: AppDictionary, result: RedeemPromoResponse): string {
  switch (result.type) {
    case 'VIP_DAYS':
      return dict.promoInput.rewardVipDays(result.rewardValue);
    case 'COINS':
      return dict.promoInput.rewardCoins(result.rewardValue);
    case 'CROSS_BORDER_ACCESS':
      return dict.promoInput.rewardCrossBorder;
  }
}

interface PromoCodeInputProps {
  onRedeemed?: (result: RedeemPromoResponse) => void;
}

export function PromoCodeInput({ onRedeemed }: PromoCodeInputProps) {
  const { dict } = useAppDict();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RedeemPromoResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await redeemPromoCode(code.trim());
      setResult(data);
      setCode('');
      onRedeemed?.(data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? dict.common.errorGeneric);
      } else {
        setError(dict.common.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
          <GiftIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-display font-bold text-blue-900">{dict.promoInput.title}</h3>
          <p className="text-xs text-ink-500">{dict.promoInput.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-start gap-2">
        <div className="flex-1">
          <Input
            aria-label={dict.promoInput.title}
            placeholder={dict.promoInput.placeholder}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="uppercase tracking-widest"
          />
        </div>
        <Button type="submit" variant="rose" loading={loading} disabled={!code.trim()}>
          {dict.promoInput.activate}
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {result && (
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{dict.promoInput.success(rewardLabel(dict, result))}</p>
        </div>
      )}
    </div>
  );
}
