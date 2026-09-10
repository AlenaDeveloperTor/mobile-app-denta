import { authAPI } from '@/api/auth';
import { setUnauthorizedHandler } from '@/api/client';
import type { CodeRequestResponse, UpdateProfileInput, User } from '@/types/user';
import { getDeviceId } from '@/utils/device';
import { storage } from '@/utils/storage';
import { create } from 'zustand';
import { useLoyaltyStore } from './useLoyaltyStore';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  requestCode: (phone: string) => Promise<CodeRequestResponse>;
  verifyCode: (sessionId: string, code: string) => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<void>;
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
        // Синхронизируем баланс бонусов при проверке авторизации
        if (res.data.loyalty_balance !== undefined) {
          useLoyaltyStore.getState().setBalance(res.data.loyalty_balance);
        }
      }
    } catch {
      await storage.removeTokens();
    } finally {
      set({ isLoading: false });
    }
  },

  requestCode: async (phone: string) => {
    const res = await authAPI.requestCode(phone);
    return res.data;
  },

  verifyCode: async (sessionId: string, code: string) => {
    const deviceId = await getDeviceId();
    const res = await authAPI.verifyCode(sessionId, code, deviceId);
    await storage.setTokens(res.data.access_token, res.data.refresh_token);
    set({ user: res.data.user, isAuthenticated: true });
    // Синхронизируем баланс бонусов после верификации кода
    if (res.data.user.loyalty_balance !== undefined) {
      useLoyaltyStore.getState().setBalance(res.data.user.loyalty_balance);
    }
  },

  updateProfile: async (data: UpdateProfileInput) => {
    const res = await authAPI.updateProfile(data);
    set({ user: res.data });
    // Синхронизируем баланс бонусов при обновлении профиля
    if (res.data.loyalty_balance !== undefined) {
      useLoyaltyStore.getState().setBalance(res.data.loyalty_balance);
    }
  },

  logout: async () => {
    await storage.removeTokens();
    set({ user: null, isAuthenticated: false });
  },
}));

// При получении 401 от API сбрасываем сессию
setUnauthorizedHandler(() => {
  storage.removeTokens();
  useAuthStore.setState({ user: null, isAuthenticated: false });
});
