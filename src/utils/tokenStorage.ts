import type { AuthResponse, UserInfo } from '../types';

const ACCESS_KEY = 'vcraft_access_token';
const REFRESH_KEY = 'vcraft_refresh_token';
const USER_KEY = 'vcraft_user';

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_KEY);

export const getUser = (): UserInfo | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
};

export const setTokens = (data: {
  accessToken?: string;
  refreshToken?: string;
  user?: UserInfo;
}): void => {
  if (data.accessToken) localStorage.setItem(ACCESS_KEY, data.accessToken);
  if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
};

export const setAuth = (auth: AuthResponse): void => {
  setTokens({
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    user: auth.user,
  });
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => Boolean(getAccessToken());