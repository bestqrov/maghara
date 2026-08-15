import { api } from './api';

export type PromoCodeType = 'VIP_DAYS' | 'COINS' | 'CROSS_BORDER_ACCESS';

export interface RedeemPromoResponse {
  message: string;
  type: PromoCodeType;
  rewardValue: number;
  subscriptionTier: 'FREE' | 'VIP' | 'CROSS_BORDER_VIP';
  coinBalance: number;
  vipExpiresAt?: string;
}

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalReferred: number;
  verifiedReferred: number;
}

export async function redeemPromoCode(code: string) {
  const { data } = await api.post<RedeemPromoResponse>('/promos/redeem', { code });
  return data;
}

export async function getReferralInfo() {
  const { data } = await api.get<ReferralInfo>('/promos/referral');
  return data;
}
