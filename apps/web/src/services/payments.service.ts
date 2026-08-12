import { api } from './api';

export type PaymentMethod = 'CRYPTO_TRC20' | 'CRYPTO_POLYGON' | 'CRYPTO_SOLANA' | 'BANK_TRANSFER' | 'CASH_PLUS';
export type TransactionType = 'COIN_PURCHASE' | 'VIP_SUBSCRIPTION' | 'VERIFICATION_FEE';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  txHashOrReceipt?: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}

export interface CreateTransactionPayload {
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  type: TransactionType;
  txHashOrReceipt: string;
}

export async function createTransaction(payload: CreateTransactionPayload) {
  const { data } = await api.post<Transaction>('/payments/transactions', payload);
  return data;
}

export async function getMyTransactions() {
  const { data } = await api.get<Transaction[]>('/payments/transactions/me');
  return data;
}

export const COIN_PACKAGES = [
  { coins: 10, priceLabel: '20 درهم' },
  { coins: 30, priceLabel: '50 درهم' },
  { coins: 100, priceLabel: '150 درهم' },
] as const;

export const VIP_PLAN = { amount: 99, label: 'VIP شهري', priceLabel: '99 درهم / الشهر' } as const;

export const CRYPTO_WALLETS: Record<string, string> = {
  CRYPTO_TRC20: 'PLACEHOLDER_TRC20_ADDRESS_CONFIGURE_ME',
  CRYPTO_POLYGON: 'PLACEHOLDER_POLYGON_ADDRESS_CONFIGURE_ME',
  CRYPTO_SOLANA: 'PLACEHOLDER_SOLANA_ADDRESS_CONFIGURE_ME',
};

export const BANK_DETAILS: Record<string, { bank: string; rib: string }> = {
  BANK_TRANSFER: { bank: 'CIH Bank', rib: 'PLACEHOLDER_RIB_CONFIGURE_ME' },
  CASH_PLUS: { bank: 'Cash Plus', rib: 'PLACEHOLDER_CASHPLUS_CODE_CONFIGURE_ME' },
};
