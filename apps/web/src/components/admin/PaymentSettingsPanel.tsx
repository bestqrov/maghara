'use client';

import { useEffect, useState } from 'react';
import { getAdminPaymentSettings, updatePaymentSettings } from '@/services/admin.service';
import type { PaymentSettings } from '@/services/paymentSettings.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const EMPTY: PaymentSettings = {
  cryptoWallets: { trc20: '', polygon: '', solana: '' },
  bankTransfer: { bankName: '', accountHolder: '', rib: '' },
  cashPlus: { code: '' },
  internationalWire: { bankName: '', accountHolder: '', iban: '', swiftBic: '', bankAddress: '' },
};

export function PaymentSettingsPanel() {
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
      setError('تعذّر جلب إعدادات الدفع');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
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
      setError('تعذّر حفظ إعدادات الدفع');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">جارٍ التحميل...</p>;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <p className="text-sm text-ink-500">
        هاد الحسابات هي اللي كتبان للأعضاء ملي يبغيو يشحنو نقاط أو يشتركو فـ VIP. خلي أي حقل فارغ باش تخفي الطريقة ديالو من
        المستخدمين.
      </p>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">محافظ العملات الرقمية (USDT)</h3>
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
        <h3 className="font-semibold text-blue-900">تحويل بنكي محلي</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="bankName"
            label="اسم البنك"
            value={form.bankTransfer.bankName ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankTransfer: { ...f.bankTransfer, bankName: e.target.value } }))}
          />
          <Input
            id="bankAccountHolder"
            label="صاحب الحساب"
            value={form.bankTransfer.accountHolder ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, bankTransfer: { ...f.bankTransfer, accountHolder: e.target.value } }))
            }
          />
          <Input
            id="bankRib"
            label="RIB"
            value={form.bankTransfer.rib ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, bankTransfer: { ...f.bankTransfer, rib: e.target.value } }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">Cash Plus</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="cashPlusCode"
            label="الرمز / الرقم"
            value={form.cashPlus.code ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, cashPlus: { ...f.cashPlus, code: e.target.value } }))}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-blue-100 bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-blue-900">حوالة دولية (IBAN / SWIFT)</h3>
        <p className="mt-1 text-xs text-ink-500">لأعضاء الجالية اللي بغاو يحولو من برا المغرب.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            id="wireBankName"
            label="اسم البنك"
            value={form.internationalWire.bankName ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, bankName: e.target.value } }))
            }
          />
          <Input
            id="wireAccountHolder"
            label="صاحب الحساب"
            value={form.internationalWire.accountHolder ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, accountHolder: e.target.value } }))
            }
          />
          <Input
            id="wireIban"
            label="IBAN"
            value={form.internationalWire.iban ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, iban: e.target.value } }))
            }
          />
          <Input
            id="wireSwift"
            label="SWIFT / BIC"
            value={form.internationalWire.swiftBic ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, swiftBic: e.target.value } }))
            }
          />
          <Input
            id="wireBankAddress"
            label="عنوان البنك (اختياري)"
            value={form.internationalWire.bankAddress ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, internationalWire: { ...f.internationalWire, bankAddress: e.target.value } }))
            }
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-emerald-600">تم حفظ إعدادات الدفع بنجاح</p>}

      <Button type="submit" loading={saving} className="self-start text-sm">
        حفظ الإعدادات
      </Button>
    </form>
  );
}
