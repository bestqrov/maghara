import { create } from 'zustand';
import { AdSettings, getAdSettings } from '@/services/adSettings.service';

interface AdSettingsState {
  settings: AdSettings | null;
  fetched: boolean;
  fetch: () => Promise<void>;
}

export const useAdSettingsStore = create<AdSettingsState>()((set, get) => ({
  settings: null,
  fetched: false,
  fetch: async () => {
    if (get().fetched) return;
    try {
      const settings = await getAdSettings();
      set({ settings, fetched: true });
    } catch {
      // Best-effort: ads just stay off if the config can't be fetched (e.g. logged out).
      set({ fetched: true });
    }
  },
}));
