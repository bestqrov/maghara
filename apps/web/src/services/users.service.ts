import { api } from './api';
import { AuthUser } from '@/store/auth.store';

export interface FullUser extends AuthUser {
  coinBalance: number;
  dailyInterestsSent: number;
  isVerified: boolean;
  verificationStatus: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  currentCity?: string;
  residenceCountry?: string;
  originCountry?: string;
  relocationPreference?: 'OPEN_TO_MOVE' | 'LOOKING_FOR_EXPAT' | 'LOCAL_ONLY';
  jobTitle?: string;
  educationLevel?: string;
  bio?: string;
  photos?: string[];
  minAge?: number;
  maxAge?: number;
  targetCountries?: string[];
  targetCities?: string[];
  waliName?: string;
  waliPhone?: string;
  waliRelationship?: string;
}

export async function getMe() {
  const { data } = await api.get<FullUser>('/users/me');
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const { data } = await api.patch<AuthUser>('/users/me/profile', payload);
  return data;
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  const { data } = await api.patch<{ message: string }>('/users/me/password', payload);
  return data;
}

export async function deleteAccount(payload: { password: string }) {
  const { data } = await api.delete<{ message: string }>('/users/me', { data: payload });
  return data;
}
