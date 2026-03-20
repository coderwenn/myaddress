import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
};

const resolveBaseUrl = () => {
  try {
    return (import.meta as any)?.env?.VITE_API_BASE ?? '/api';
  } catch {
    return '/api';
  }
};

export const api: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    getCookie('AICHAT') ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) ||
    (typeof localStorage !== 'undefined' ? localStorage.getItem('AICHAT') : null);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data ?? response,
  (error) => Promise.reject(error),
);

export const request = <T = any>(config: AxiosRequestConfig) => api.request<T>(config);

export default api;
