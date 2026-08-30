import { api } from './client';

export const pushAPI = {
  /** Регистрирует push-токен на сервере */
  registerToken: (deviceId: string, token: string, platform: 'ios' | 'android') =>
    api.post<{ success: boolean }>('/push/register', { device_id: deviceId, token, platform }),

  /** Отвязывает push-токен по device_id */
  unregisterToken: (deviceId: string) =>
    api.post<{ success: boolean }>('/push/unregister', { device_id: deviceId }),
};
