import axios from 'axios';
import { useAdminStore } from '@/store/admin.store';

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
});

adminApi.interceptors.request.use((config) => {
  const adminKey = useAdminStore.getState().adminKey;
  if (adminKey) {
    config.headers['x-admin-key'] = adminKey;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminStore.getState().logout();
    }
    return Promise.reject(error);
  },
);
