export const APP_NAME = 'Denta';

export const APP_VERSION = '1.0.0';

/** Ключи AsyncStorage */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  FCM_TOKEN: 'fcm_token',
} as const;

/** Настройки записи к врачу */
export const BOOKING = {
  MAX_HORIZON_DAYS: 30,
  MIN_HOUR: 9,
  MAX_HOUR: 20,
} as const;
