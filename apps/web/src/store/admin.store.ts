import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  adminToken: string | null;
  hasHydrated: boolean;
  setAdminToken: (token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminToken: null,
      hasHydrated: false,
      setAdminToken: (token) => set({ adminToken: token }),
      logout: () => set({ adminToken: null }),
    }),
    {
      name: 'zawaj-admin',
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
