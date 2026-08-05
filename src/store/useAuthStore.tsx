import { authAPI } from '@/api/auth';
import { setUnauthorizedHandler } from '@/api/client';
import type { CodeRequestResponse, User } from '@/types/user';
import { storage } from '@/utils/storage';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  requestCode: (phone: string) => Promise<CodeRequestResponse>;
  verifyCode: (phone: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  checkAuth: async () => {
    try {
      const token = await storage.getToken();
      if (token) {
        const res = await authAPI.getProfile();
        set({ user: res.data, isAuthenticated: true });
      }
    } catch {
      await storage.removeToken();
    } finally {
      set({ isLoading: false });
    }
  },

  requestCode: async (phone: string) => {
    const res = await authAPI.requestCode(phone);
    return res.data;
  },

  verifyCode: async (phone: string, code: string) => {
    const res = await authAPI.verifyCode(phone, code);
    await storage.setToken(res.data.token);
    set({ user: res.data.user, isAuthenticated: true });
  },

  logout: async () => {
    await storage.removeToken();
    set({ user: null, isAuthenticated: false });
  },
}));

// При получении 401 от API сбрасываем сессию
setUnauthorizedHandler(() => {
  storage.removeToken();
  useAuthStore.setState({ user: null, isAuthenticated: false });
});
