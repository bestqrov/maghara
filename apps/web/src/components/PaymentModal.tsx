'use client';

import { useState } from 'react';
import {
  BANK_DETAILS,
  createTransaction,
  CRYPTO_WALLETS,
  PaymentMethod,
  TransactionType,
} from '@/services/payments.service';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ImageUploader } from './ImageUploader';
import { useAppDict } from '@/hooks/useLocale';

interface PaymentModalProps {
  amount: number;
  type: TransactionType;
  title: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ amount, type, title, onClose, onSuccess }: PaymentModalProps) {
  const { dict } = useAppDict();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const METHODS: { value: PaymentMethod; label: string; kind: 'crypto' | 'manual' }[] = [
    { value: 'CRYPTO_TRC20', label: 'USDT (TRC-20)', kind: 'crypto' },
    { value: 'CRYPTO_POLYGON', label: 'USDT (Polygon)', kind: 'crypto' },
    { value: 'CRYPTO_SOLANA', label: 'USDT (Solana)', kind: 'crypto' },
    { value: 'BANK_TRANSFER', label: dict.paymentModal.bankTransfer, kind: 'manual' },
    { value: 'CASH_PLUS', label: 'Cash Plus', kind: 'manual' },
  ];

  const selected = METHODS.find((m) => m.value === method);

  async function handleSubmit() {
    if (!method || !reference.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createTransaction({ amount, currency: 'MAD', paymentMethod: method, type, txHashOrReceipt: reference.trim() });
      setDone(true);
      onSuccess();
    } catch {
      setError(dict.paymentModal.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-900/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-surface p-6">
        {done ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">✓</div>
            <h2 className="mt-4 text-lg font-bold text-emerald-700">{dict.paymentModal.doneTitle}</h2>
            <p className="mt-2 text-sm text-ink-500">{dict.paymentModal.doneSubtitle}</p>
            <Button onClick={onClose} className="mt-6 w-full">
              {dict.paymentModal.doneButton}
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-emerald-700">{title}</h2>
            <p className="mt-1 text-sm text-ink-500">{dict.paymentModal.choosePaymentMethod}</p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => {
                    setMethod(m.value);
                    setReference('');
                  }}
                  className={`rounded-xl border px-4 py-2.5 text-right text-sm font-medium transition ${
                    method === m.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-emerald-100 text-ink-700 hover:bg-emerald-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {selected && selected.kind === 'crypto' && (
              <div className="mt-4 rounded-xl bg-gold-100 p-3 text-xs">
                <p className="font-semibold text-emerald-900">{dict.paymentModal.sendCryptoTo(amount)}</p>
                <p className="mt-1 break-all rounded-lg bg-surface p-2 font-mono text-emerald-700">
                  {CRYPTO_WALLETS[selected.value]}
                </p>
                <p className="mt-2 text-red-600">{dict.paymentModal.placeholderWarningCrypto}</p>
              </div>
            )}

            {selected && selected.kind === 'manual' && (
              <div className="mt-4 rounded-xl bg-gold-100 p-3 text-xs">
                <p className="font-semibold text-emerald-900">{dict.paymentModal.transferTo(amount)}</p>
                <p className="mt-1 text-emerald-700">{BANK_DETAILS[selected.value].bank}</p>
                <p className="mt-1 break-all rounded-lg bg-surface p-2 font-mono text-emerald-700">
                  {BANK_DETAILS[selected.value].rib}
                </p>
                <p className="mt-2 text-red-600">{dict.paymentModal.placeholderWarningBank}</p>
              </div>
            )}

            {selected && selected.kind === 'crypto' && (
              <div className="mt-4">
                <Input
                  label={dict.paymentModal.txHashLabel}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="0x..."
                />
              </div>
            )}

            {selected && selected.kind === 'manual' && (
              <div className="mt-4">
                <ImageUploader label={dict.paymentModal.receiptLabel} onUploaded={setReference} folder="zawaj/receipts" />
              </div>
            )}

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                {dict.paymentModal.close}
              </Button>
              <Button onClick={handleSubmit} loading={loading} disabled={!method || !reference.trim()} className="flex-1">
                {dict.paymentModal.confirmPayment}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
