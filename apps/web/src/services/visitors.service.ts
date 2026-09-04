import { api } from './api';

export interface VisitorEntry {
  visitor: {
    _id: string;
    profile: {
      firstName: string;
      photos: string[];
    };
    subscriptionTier: string;
    isOnline: boolean;
  } | null;
  visitedAt: string;
  locked: boolean;
}

export async function recordVisit(profileId: string) {
  await api.post(`/visitors/visit/${profileId}`);
}

export async function getMyVisitors() {
  const { data } = await api.get<VisitorEntry[]>('/visitors/me');
  return data;
}
