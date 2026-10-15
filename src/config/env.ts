import {
  API_URL as envApiUrl,
  MAX_BOT_DEEP_LINK as envMaxBotDeepLink,
  PRIVACY_POLICY_URL as envPrivacyPolicyUrl,
} from '@env';

export const API_URL = envApiUrl || 'https://api.clinic.com/v1';

/** Ссылка на бота в MAX (deep link) — открывает чат с ботом */
export const MAX_BOT_DEEP_LINK =
  envMaxBotDeepLink || 'https://max.ru/YourBot?start=';

/** Ссылка на политику обработки персональных данных (152-ФЗ) */
export const PRIVACY_POLICY_URL =
  envPrivacyPolicyUrl || 'https://backend.novsergey.online/privacy-policy';
