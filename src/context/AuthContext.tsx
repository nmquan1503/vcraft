import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { AuthResponse, UserInfo } from '@/types';
import {
  clearTokens,
  getAccessToken,
  getUser,
  setAuth as persistAuth,
} from '@/utils/tokenStorage';

interface AuthContextValue {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (auth: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(() => getUser());
  const [authed, setAuthed] = useState<boolean>(() => Boolean(getAccessToken()));

  const login = useCallback((auth: AuthResponse) => {
    persistAuth(auth);
    setUser(auth.user);
    setAuthed(true);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setAuthed(false);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith('vcraft_')) {
        setUser(getUser());
        setAuthed(Boolean(getAccessToken()));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}