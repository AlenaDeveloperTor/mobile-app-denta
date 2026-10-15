import * as WebBrowser from 'expo-web-browser';
import { PRIVACY_POLICY_URL } from '@/config/env';
import { COLORS } from '@/constants/theme';

/**
 * Открывает политику обработки персональных данных во встроенном браузере (In-App Browser).
 * Если URL недоступен или браузер выдал ошибку, вызывает fallback callback (например, открытие модального окна в приложении).
 */
export async function openPrivacyPolicy(onFallback?: () => void): Promise<boolean> {
  const url = PRIVACY_POLICY_URL?.trim();

  if (!url || !/^https?:\/\//i.test(url)) {
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
