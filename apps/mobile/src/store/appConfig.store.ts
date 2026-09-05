import { create } from 'zustand';
import { AppConfig, getAppConfig } from '@/services/appConfig.service';

interface AppConfigState {
  config: AppConfig | null;
  checked: boolean;
  fetch: () => Promise<void>;
}

export const useAppConfigStore = create<AppConfigState>()((set) => ({
  config: null,
  checked: false,
  fetch: async () => {
    try {
      const config = await getAppConfig();
      set({ config, checked: true });
    } catch {
      // Fail open: a network hiccup while fetching config should never lock users out of the app.
      set({ config: null, checked: true });
    }
  },
}));
