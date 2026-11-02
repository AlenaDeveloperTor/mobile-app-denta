import {
  API_URL as envApiUrl,
  MAX_BOT_DEEP_LINK as envMaxBotDeepLink,
  PRIVACY_POLICY_URL as envPrivacyPolicyUrl,
  FCM_SENDER_ID as envFcmSenderId,
  EAS_PROJECT_ID as envEasProjectId,
  GLITCHTIP_DSN as envGlitchTipDsn,
  EXPO_PUBLIC_GLITCHTIP_DSN as envExpoPublicGlitchTipDsn,
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
 * Обязателен для работы push-уведомлений на Android.
 */
export const FCM_SENDER_ID = envFcmSenderId || '';

/**
 * EAS Project ID для получения Expo Push Token.
 * Берётся из eas.json / app.json → extra.eas.projectId.
 */
export const EAS_PROJECT_ID = envEasProjectId || '';

/**
 * GlitchTip / Sentry DSN для мониторинга ошибок и падений.
 * Поддерживает загрузку как из @env, так и из process.env.EXPO_PUBLIC_GLITCHTIP_DSN.
 */
export const GLITCHTIP_DSN =
  envGlitchTipDsn ||
  envExpoPublicGlitchTipDsn ||
  process.env.EXPO_PUBLIC_GLITCHTIP_DSN ||
  '';
