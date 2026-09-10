import type { AuthResponse, CodeRequestResponse, TokenPair, UpdateProfileInput, User } from '@/types/user';
import { api } from './client';

export const authAPI = {
  /** Запросить код подтверждения по телефону (отправка через MAX) */
  requestCode: (phone: string) =>
    api.post<CodeRequestResponse>('/auth/request-code', { phone }),

  /** Подтвердить код по session_id и получить пару токенов */
  verifyCode: (sessionId: string, code: string, deviceId: string) =>
    api.post<AuthResponse>('/auth/verify-code', { session_id: sessionId, code, device_id: deviceId }),

  /** Обновить пару токенов по refresh-токену */
  refresh: (refreshToken: string) =>
    api.post<TokenPair>('/auth/refresh', { refresh_token: refreshToken }),

  /** Получить профиль текущего пользователя */
  getProfile: () => api.get<User>('/users/me'),

  /** Обновить профиль текущего пользователя */
  updateProfile: (data: UpdateProfileInput) => api.patch<User>('/users/me', data),
};
