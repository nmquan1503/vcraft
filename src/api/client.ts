import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/tokenStorage';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let subscribers: Array<(token: string | null) => void> = [];

const flush = (token: string | null) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<Record<string, string>>(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken }
    );
    const token = data?.accessToken;
    if (!token) return null;
    setTokens({ accessToken: token });
    return token;
  } catch {
    return null;
  }
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (!original) return Promise.reject(error);

    const status = error.response?.status;
    const url = original.url ?? '';
    const isRefreshCall = url.includes('/auth/refresh-token');
    const isAuthCall =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password');

    if (status !== 401 || original._retry || isRefreshCall || isAuthCall) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribers.push((token) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(client(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      if (!newToken) throw new Error('Refresh failed');

      flush(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return client(original);
    } catch {
      clearTokens();
      flush(null);

      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;