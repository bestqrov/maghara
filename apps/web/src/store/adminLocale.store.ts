import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminLocale } from '@/dictionaries/admin';

interface AdminLocaleState {
  locale: AdminLocale;
  hasHydrated: boolean;
  setLocale: (locale: AdminLocale) => void;
}

export const useAdminLocaleStore = create<AdminLocaleState>()(
  persist(
    (set) => ({
      locale: 'ar',
      hasHydrated: false,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'zawaj-admin-locale',
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
