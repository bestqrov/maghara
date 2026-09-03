'use client';

import { useEffect, useState } from 'react';
import { getAdminPaymentSettings, updatePaymentSettings } from '@/services/admin.service';
import type { PaymentSettings } from '@/services/paymentSettings.service';
import { useAdminDict } from '@/hooks/useAdminLocale';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const EMPTY: PaymentSettings = {
  cryptoWallets: { trc20: '', polygon: '', solana: '' },
  bankTransfer: { bankName: '', accountHolder: '', rib: '' },
  cashPlus: { code: '' },
  internationalWire: { bankName: '', accountHolder: '', iban: '', swiftBic: '', bankAddress: '' },
};

export function PaymentSettingsPanel() {
  const { dict } = useAdminDict();
  const [form, setForm] = useState<PaymentSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setForm(await getAdminPaymentSettings());
    } catch {
      setError(dict.paymentSettings.errorFetch);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      setForm(await updatePaymentSettings(form));
      setSuccess(true);
    } catch {
      setError(dict.paymentSettings.errorSave);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">{dict.common.loading}</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <p className="text-sm text-ink-500">{dict.paymentSettings.intro}</p>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.paymentSettings.cryptoTitle}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="cryptoTrc20"
            label="TRC-20"
            value={form.cryptoWallets.trc20 ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, cryptoWallets: { ...f.cryptoWallets, trc20: e.target.value } }))}
          />
          <Input
            id="cryptoPolygon"
            label="Polygon"
            value={form.cryptoWallets.polygon ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, cryptoWallets: { ...f.cryptoWallets, polygon: e.target.value } }))}
          />
          <Input
            id="cryptoSolana"
            label="Solana"
            value={form.cryptoWallets.solana ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, cryptoWallets: { ...f.cryptoWallets, solana: e.target.value } }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.paymentSettings.bankTitle}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="bankName"
            label={dict.paymentSettings.bankNameLabel}
            value={form.bankTransfer.bankName ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankTransfer: { ...f.bankTransfer, bankName: e.target.value } }))}
          />
          <Input
            id="bankAccountHolder"
            label={dict.paymentSettings.accountHolderLabel}
            value={form.bankTransfer.accountHolder ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, bankTransfer: { ...f.bankTransfer, accountHolder: e.target.value } }))
            }
          />
          <Input
            id="bankRib"
            label={dict.paymentSettings.ribLabel}
            value={form.bankTransfer.rib ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankTransfer: { ...f.bankTransfer, rib: e.target.value } }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.paymentSettings.cashPlusTitle}</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="cashPlusCode"
            label={dict.paymentSettings.cashPlusCodeLabel}
            value={form.cashPlus.code ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, cashPlus: { ...f.cashPlus, code: e.target.value } }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">{dict.paymentSettings.wireTitle}</h3>
        <p className="mt-1 text-xs text-ink-500">{dict.paymentSettings.wireSubtitle}</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            id="wireBankName"
            label={dict.paymentSettings.bankNameLabel}
            value={form.internationalWire.bankName ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, bankName: e.target.value } }))
            }
          />
          <Input
            id="wireAccountHolder"
            label={dict.paymentSettings.accountHolderLabel}
            value={form.internationalWire.accountHolder ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, accountHolder: e.target.value } }))
            }
          />
          <Input
            id="wireIban"
            label={dict.paymentSettings.ibanLabel}
            value={form.internationalWire.iban ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, iban: e.target.value } }))
            }
          />
          <Input
            id="wireSwift"
            label={dict.paymentSettings.swiftLabel}
            value={form.internationalWire.swiftBic ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, swiftBic: e.target.value } }))
            }
          />
          <Input
            id="wireBankAddress"
            label={dict.paymentSettings.bankAddressLabel}
            value={form.internationalWire.bankAddress ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, bankAddress: e.target.value } }))
            }
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{dict.paymentSettings.success}</p>}

      <Button type="submit" loading={saving} className="self-start text-sm">
        {dict.paymentSettings.save}
      </Button>
    </form>
  );
}
