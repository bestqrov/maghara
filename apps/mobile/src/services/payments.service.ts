import { api } from './api';

export type PaymentMethod =
  | 'CRYPTO_TRC20'
  | 'CRYPTO_POLYGON'
  | 'CRYPTO_SOLANA'
  | 'BANK_TRANSFER'
  | 'CASH_PLUS';
export type TransactionType =
  'COIN_PURCHASE' | 'VIP_SUBSCRIPTION' | 'VERIFICATION_FEE';
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

export async function getMyTransactions() {
  const { data } = await api.get<Transaction[]>('/payments/transactions/me');
  return data;
}

export const COIN_PACKAGES = [
  { coins: 10, priceLabel: '20 درهم' },
  { coins: 30, priceLabel: '50 درهم' },
  { coins: 100, priceLabel: '150 درهم' },
] as const;

export const VIP_PLAN = {
  amount: 99,
  label: 'VIP شهري',
  priceLabel: '99 درهم / الشهر',
} as const;
