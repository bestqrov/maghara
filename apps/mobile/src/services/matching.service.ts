import { api } from './api';

export interface SearchFilters {
  minAge?: number;
  maxAge?: number;
  targetCountry?: string;
  targetCity?: string;
  relocationPreference?: 'OPEN_TO_MOVE' | 'LOOKING_FOR_EXPAT' | 'LOCAL_ONLY';
  page?: number;
  limit?: number;
}

export interface SearchResultProfile {
  _id: string;
  isVerified: boolean;
  verificationStatus: string;
  subscriptionTier: string;
  blurred: boolean;
  profile: {
    firstName: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;
    residenceCountry: string;
    currentCity: string;
    originCountry: string;
    relocationPreference: string;
    jobTitle?: string;
    bio?: string;
    photos: string[];
  };
}

export async function searchProfiles(filters: SearchFilters) {
  const { data } = await api.get<SearchResultProfile[]>('/matching/search', { params: filters });
  return data;
}

export async function sendInterest(receiverId: string, isSuperLike = false) {
  const { data } = await api.post(`/matching/interest/${receiverId}`, { isSuperLike });
  return data;
}

export const DAILY_FREE_INTERESTS = 5;
