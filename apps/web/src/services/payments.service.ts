import { api } from './api';

export type PaymentMethod =
  | 'CRYPTO_TRC20'
  | 'CRYPTO_POLYGON'
  | 'CRYPTO_SOLANA'
  | 'BANK_TRANSFER'
  | 'CASH_PLUS'
  | 'INTERNATIONAL_WIRE';
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
