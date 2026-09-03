import { api } from './api';

export interface PaymentSettings {
  cryptoWallets: { trc20?: string; polygon?: string; solana?: string };
  bankTransfer: { bankName?: string; accountHolder?: string; rib?: string };
  cashPlus: { code?: string };
  internationalWire: { bankName?: string; accountHolder?: string; iban?: string; swiftBic?: string; bankAddress?: string };
}

export async function getPaymentSettings() {
  const { data } = await api.get<PaymentSettings>('/payment-settings');
  return data;
}
