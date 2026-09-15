export const APP_NAME = 'labsmile';

export const APP_VERSION = '1.0.0';

/** Ключи AsyncStorage */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  EXPO_PUSH_TOKEN: 'expo_push_token',
  DEVICE_ID: 'device_id',
} as const;

/** Настройки записи к врачу */
export const BOOKING = {
  MAX_HORIZON_DAYS: 30,
  MIN_HOUR: 9,
  MAX_HOUR: 20,
} as const;
