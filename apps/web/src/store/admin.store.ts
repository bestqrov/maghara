import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  adminKey: string | null;
  hasHydrated: boolean;
  setAdminKey: (key: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminKey: null,
      hasHydrated: false,
      setAdminKey: (key) => set({ adminKey: key }),
      logout: () => set({ adminKey: null }),
    }),
    {
      name: 'zawaj-admin',
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
