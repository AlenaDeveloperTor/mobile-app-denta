import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { PRIVACY_POLICY_URL } from '@/config/env';
import { COLORS } from '@/constants/theme';

/**
 * Открывает политику обработки персональных данных во внешнем/встроенном браузере.
 *
 * Логика:
 *  1. Если PRIVACY_POLICY_URL не задан или некорректен — вызывает onFallback (встроенный текст).
 *  2. На Web открывает страницу в новой вкладке браузера (без CORS-запросов).
 *  3. На мобильных устройствах открывает встроенный In-App Browser (WebBrowser).
 *  4. При ошибке браузера вызывает onFallback.
 */
export async function openPrivacyPolicy(onFallback?: () => void): Promise<boolean> {
  const url = PRIVACY_POLICY_URL?.trim();

  if (!url || !/^https?:\/\//i.test(url)) {
    onFallback?.();
    return false;
  }

  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
        return true;
      }
    }

    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: COLORS.dark,
      toolbarColor: COLORS.white,
      showTitle: true,
      enableBarCollapsing: true,
    });
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn('[openPrivacyPolicy] Ошибка открытия браузера, переход к запасному экрану:', error);
    }
    onFallback?.();
    return false;
  }
}