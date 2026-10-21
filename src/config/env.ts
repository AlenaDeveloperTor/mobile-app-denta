import {
  API_URL as envApiUrl,
  MAX_BOT_DEEP_LINK as envMaxBotDeepLink,
  PRIVACY_POLICY_URL as envPrivacyPolicyUrl,
  FCM_SENDER_ID as envFcmSenderId,
  EAS_PROJECT_ID as envEasProjectId,
} from '@env';

export const API_URL = envApiUrl || 'https://api.clinic.com/v1';

/** Ссылка на бота в MAX (deep link) — открывает чат с ботом */
export const MAX_BOT_DEEP_LINK =
  envMaxBotDeepLink || 'https://max.ru/YourBot?start=';

/** Ссылка на политику обработки персональных данных (152-ФЗ) */
export const PRIVACY_POLICY_URL =
  envPrivacyPolicyUrl || 'https://api.clinic.com/v1/privacy-policy';

/**
 * Firebase Cloud Messaging Sender ID.
 * Берётся из google-services.json → project_number.
 * Значение: 877661775122
 */
export const FCM_SENDER_ID = envFcmSenderId || '877661775122';

/**
 * EAS Project ID для получения Expo Push Token.
 * Берётся из eas.json / app.json → extra.eas.projectId.
 * Значение: c275c99b-f1f1-4842-b1f8-d8acb43ab83c
 */
export const EAS_PROJECT_ID = envEasProjectId || 'c275c99b-f1f1-4842-b1f8-d8acb43ab83c';

