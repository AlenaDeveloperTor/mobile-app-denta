import * as WebBrowser from 'expo-web-browser';
import { PRIVACY_POLICY_URL } from '@/config/env';
import { COLORS } from '@/constants/theme';

/**
 * Проверяет доступность URL через HEAD-запрос.
 * Возвращает false если нет соединения или сервер вернул 4xx/5xx.
 */
async function isUrlAvailable(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 сек таймаут
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return res.ok; // true только при 2xx
  } catch {
    return false;
  }
}

/**
 * Открывает политику обработки персональных данных во встроенном браузере (In-App Browser).
 *
 * Логика:
 *  1. Если PRIVACY_POLICY_URL не задан — сразу вызывает onFallback (встроенный текст).
 *  2. Если URL задан — делает HEAD-запрос для проверки доступности.
 *  3. Если сервер вернул 4xx/5xx или нет связи — вызывает onFallback (встроенный текст).
 *  4. Если URL доступен — открывает In-App Browser.
 */
export async function openPrivacyPolicy(onFallback?: () => void): Promise<boolean> {
  const url = PRIVACY_POLICY_URL?.trim();

  if (!url || !/^https?:\/\//i.test(url)) {
    onFallback?.();
    return false;
  }

  const available = await isUrlAvailable(url);
  if (!available) {
    console.warn('[openPrivacyPolicy] URL недоступен (нет маршрута или нет связи), открываем встроенный текст');
    onFallback?.();
    return false;
  }

  try {
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: COLORS.dark,
      toolbarColor: COLORS.white,
      showTitle: true,
      enableBarCollapsing: true,
    });
    return true;
  } catch (error) {
    console.warn('[openPrivacyPolicy] Ошибка открытия браузера, переход к запасному экрану:', error);
    onFallback?.();
    return false;
  }
}
