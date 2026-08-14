import { api } from './api';

export interface SearchFilters {
  minAge?: number;
  maxAge?: number;
  targetCountry?: string;
  targetCity?: string;
  relocationPreference?: 'OPEN_TO_MOVE' | 'LOOKING_FOR_EXPAT' | 'LOCAL_ONLY';
  scope?: 'LOCAL' | 'DIASPORA';
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

export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'ENGAGED';

export interface MatchEntry {
  _id: string;
  status: MatchStatus;
  isSuperLike: boolean;
  direction: 'SENT' | 'RECEIVED';
  createdAt: string;
  otherUser: {
    _id: string;
    isVerified: boolean;
    profile: {
      firstName: string;
      photos: string[];
    };
  };
}

export async function getMyMatches() {
  const { data } = await api.get<MatchEntry[]>('/matching/my-matches');
  return data;
}

export async function acceptMatch(matchId: string) {
  const { data } = await api.post(`/matching/${matchId}/accept`);
  return data;
}

export async function rejectMatch(matchId: string) {
  const { data } = await api.post(`/matching/${matchId}/reject`);
  return data;
}

export async function markEngaged(matchId: string) {
  const { data } = await api.post(`/matching/${matchId}/engaged`);
  return data;
}

export const DAILY_FREE_INTERESTS = 5;
