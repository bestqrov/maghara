import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Locale = 'ar' | 'fr' | 'en' | 'es';

interface LocaleState {
  locale: Locale;
  hasHydrated: boolean;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'ar',
      hasHydrated: false,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'zawaj-locale',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
