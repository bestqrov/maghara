import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  phoneNumber: string;
  subscriptionTier: 'FREE' | 'VIP' | 'CROSS_BORDER_VIP';
  referralCode?: string;
  profile: {
    firstName: string;
    gender: 'MALE' | 'FEMALE';
    birthDate: string;
    residenceCountry: string;
    currentCity: string;
    originCountry: string;
    relocationPreference: string;
    photos: string[];
    isPhotoBlurred: boolean;
    bio?: string;
    jobTitle?: string;
    waliName?: string;
    waliPhone?: string;
    waliRelationship?: string;
  };
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  hasHydrated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setSession: (token, user) => set({ token, user }),
      updateUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'zawaj-auth',
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
