"use client";

import { create } from "zustand";
import { UserProfile } from "@/types/auth";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (user: UserProfile, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: UserProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("accessToken") : false,

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));
