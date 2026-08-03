import type { AuthResponse, CodeRequestResponse, User } from '@/types/user';
import { api } from './client';

export const authAPI = {
  /** Запросить код подтверждения по телефону */
  requestCode: (phone: string) =>
    api.post<CodeRequestResponse>('/auth/request-code', { phone }),

  /** Подтвердить код и получить токен */
  verifyCode: (phone: string, code: string) =>
    api.post<AuthResponse>('/auth/verify', { phone, code }),

  /** Получить профиль текущего пользователя */
  getProfile: () => api.get<User>('/users/me'),
};
