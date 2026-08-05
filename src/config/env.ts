import { API_URL as envApiUrl, MAX_BOT_DEEP_LINK as envMaxBotDeepLink } from '@env';

export const API_URL = envApiUrl || 'https://api.clinic.com/v1';

/** Ссылка на бота в MAX (deep link) — открывает чат с ботом */
export const MAX_BOT_DEEP_LINK =
  envMaxBotDeepLink || 'https://max.ru/YourBot?start=';
