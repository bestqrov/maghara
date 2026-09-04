import axios from 'axios';
import { adminApi } from './adminApi';
import type { PaymentSettings } from './paymentSettings.service';

export interface SignupCampaign {
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  vipDays: number;
}

export interface UpdateSignupCampaignPayload {
  active?: boolean;
  startsAt?: string;
  endsAt?: string;
  vipDays?: number;
}

export interface AnalyticsOverview {
  users: { total: number; verified: number; vip: number; newThisMonth: number };
  revenue: {
    total: number;
    thisMonth: number;
    byType: Record<'COIN_PURCHASE' | 'VIP_SUBSCRIPTION' | 'VERIFICATION_FEE', number>;
    byMonth: { month: string; total: number }[];
  };
  pending: { verifications: number; payments: number };
  promos: { active: number };
}

export interface ReferralStats {
  _id: string;
  firstName: string;
  phoneNumber: string;
  referralCode: string;
  coinBalance: number;
  totalReferred: number;
  verifiedReferred: number;
}

export interface PendingVerification {
  _id: string;
  phoneNumber: string;
  profile: { firstName: string };
  verificationDocuments?: {
    idDocumentUrl?: string;
    residencyDocumentUrl?: string;
    submittedAt?: string;
  };
}

export interface PendingTransaction {
  _id: string;
  userId: { _id: string; phoneNumber: string; profile: { firstName: string } } | string;
  amount: number;
  currency: string;
  paymentMethod: 'CRYPTO_TRC20' | 'CRYPTO_POLYGON' | 'CRYPTO_SOLANA' | 'BANK_TRANSFER' | 'CASH_PLUS';
  type: 'COIN_PURCHASE' | 'VIP_SUBSCRIPTION' | 'VERIFICATION_FEE';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  txHashOrReceipt?: string;
  createdAt: string;
}

export type PromoCodeType = 'VIP_DAYS' | 'COINS' | 'CROSS_BORDER_ACCESS';

export interface PromoCode {
  _id: string;
  code: string;
  type: PromoCodeType;
  rewardValue: number;
  maxRedemptions: number;
  currentRedemptions: number;
  requiresVerification: boolean;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreatePromoPayload {
  code: string;
  type: PromoCodeType;
  rewardValue: number;
  maxRedemptions: number;
  requiresVerification?: boolean;
  expiresAt?: string;
  isActive?: boolean;
}

export async function listPendingVerifications() {
  const { data } = await adminApi.get<PendingVerification[]>('/verification/admin/pending');
  return data;
}

export async function approveVerification(userId: string) {
  const { data } = await adminApi.post(`/verification/admin/${userId}/approve`);
  return data;
}

export async function rejectVerification(userId: string, reason?: string) {
  const { data } = await adminApi.post(`/verification/admin/${userId}/reject`, { reason });
  return data;
}

export async function listPendingTransactions() {
  const { data } = await adminApi.get<PendingTransaction[]>('/payments/admin/transactions/pending');
  return data;
}

export async function approveTransaction(transactionId: string) {
  const { data } = await adminApi.post(`/payments/admin/transactions/${transactionId}/approve`);
  return data;
}

export async function rejectTransaction(transactionId: string) {
  const { data } = await adminApi.post(`/payments/admin/transactions/${transactionId}/reject`);
  return data;
}

export async function listPromoCodes() {
  const { data } = await adminApi.get<PromoCode[]>('/promos/admin/list');
  return data;
}

export async function createPromoCode(payload: CreatePromoPayload) {
  const { data } = await adminApi.post<PromoCode>('/promos/admin/create', payload);
  return data;
}

export async function listReferrals() {
  const { data } = await adminApi.get<ReferralStats[]>('/promos/admin/referrals');
  return data;
}

export async function adminLogin(password: string) {
  const { data } = await axios.post<{ accessToken: string }>(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/admin-auth/login`,
    { password },
  );
  return data.accessToken;
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const { data } = await adminApi.post<{ message: string }>('/admin-auth/change-password', {
    currentPassword,
    newPassword,
  });
  return data;
}

export async function getSignupCampaign() {
  const { data } = await adminApi.get<SignupCampaign>('/signup-campaign');
  return data;
}

export async function updateSignupCampaign(payload: UpdateSignupCampaignPayload) {
  const { data } = await adminApi.patch<SignupCampaign>('/signup-campaign', payload);
  return data;
}

export async function getAnalyticsOverview() {
  const { data } = await adminApi.get<AnalyticsOverview>('/analytics/overview');
  return data;
}

export async function getAdminPaymentSettings() {
  const { data } = await adminApi.get<PaymentSettings>('/payment-settings');
  return data;
}

export async function updatePaymentSettings(payload: Partial<PaymentSettings>) {
  const { data } = await adminApi.patch<PaymentSettings>('/payment-settings', payload);
  return data;
}
