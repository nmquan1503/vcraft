import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/tokenStorage';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
const client = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });
client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshFlight: Promise<string | null> | null = null;
async function refreshAccessToken(): Promise<string | null> {
  const previous = getRefreshToken();
  if (!previous) return null;
  try {
    const { data } = await axios.post<{accessToken: string; refreshToken: string}>(
      `${API_BASE_URL}/auth/refresh-token`, { refreshToken: previous }, { timeout: 15000 });
    if (!data.accessToken || !data.refreshToken) return null;
    // Rotation is mandatory: never retain the now-revoked refresh token.
    setTokens(data);
    return data.accessToken;
  } catch { return null; }
}
interface RetryConfig extends InternalAxiosRequestConfig { _retry?: boolean }
client.interceptors.response.use((res) => res, async (error: AxiosError) => {
  const original = error.config as RetryConfig | undefined;
  if (!original || error.response?.status !== 401 || original._retry ||
      /\/auth\/(login|register|refresh-token|forgot-password|reset-password)/.test(original.url ?? '') ||
      !getAccessToken()) return Promise.reject(error);
  original._retry = true;
  if (!refreshFlight) {
    refreshFlight = refreshAccessToken().finally(() => { refreshFlight = null; });
  }
  const token = await refreshFlight;
  if (token) {
    original.headers.Authorization = `Bearer ${token}`;
    return client(original);
  }
  clearTokens();
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/login?redirect=${redirect}`);
  }
  return Promise.reject(error);
});
export default client;
