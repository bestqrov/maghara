import { api } from './api';

export interface AppConfig {
  general: {
    email?: string;
    author?: string;
    contact?: string;
    website?: string;
    developedBy?: string;
    description?: string;
  };
  appSettings: {
    maintenanceMode: boolean;
    maintenanceMessage?: string;
    screenshotBlock: boolean;
  };
  privacyPolicy: { url?: string; content?: string };
  termsConditions: { url?: string; content?: string };
  appUpdate: {
    enabled: boolean;
    requiredVersionCode: number;
    description?: string;
    appLink?: string;
  };
  moreAppsLink?: string;
}

export async function getAppConfig() {
  const { data } = await api.get<AppConfig>('/app-config');
  return data;
}
