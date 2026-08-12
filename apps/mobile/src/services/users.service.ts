import { api } from './api';
import { AuthUser } from '@/store/auth.store';

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
}

export async function getMe() {
  const { data } = await api.get<AuthUser>('/users/me');
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  const { data } = await api.patch<AuthUser>('/users/me/profile', payload);
  return data;
}
