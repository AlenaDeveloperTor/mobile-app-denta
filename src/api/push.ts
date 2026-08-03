import { api } from './client';

export const pushAPI = {
  /** Регистрирует push-токен на сервере */
  registerToken: (token: string, platform: 'ios' | 'android') =>
    api.post<{ success: boolean }>('/push/register', { token, platform }),

  /** Отвязывает push-токен */
  unregisterToken: (token: string) =>
    api.post<{ success: boolean }>('/push/unregister', { token }),
};
