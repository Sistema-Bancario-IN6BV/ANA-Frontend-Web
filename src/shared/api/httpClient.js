import axios from 'axios';
import { API_BASE_URL } from '../constants/env';
import { useAuthStore } from '../store/authStore';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
});

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && error.response?.data?.error !== 'MISSING_TOKEN') {
      useAuthStore.getState().logout();
    }
    const message =
      error.response?.data?.message || error.message || 'Ocurrió un error inesperado';
    return Promise.reject(new Error(message));
  }
);
