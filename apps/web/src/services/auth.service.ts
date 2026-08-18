import { api } from './api';
import { AuthUser } from '@/store/auth.store';

export interface RegisterPayload {
  phoneNumber: string;
  email?: string;
  password: string;
  firstName: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  residenceCountry: string;
  currentCity: string;
  originCountry: string;
  referralCode?: string;
}

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function checkPhoneAvailability(phoneNumber: string) {
  const { data } = await api.get<{ available: boolean }>('/auth/phone-availability', {
    params: { phoneNumber },
  });
  return data.available;
}
