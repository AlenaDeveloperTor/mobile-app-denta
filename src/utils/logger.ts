import { GLITCHTIP_DSN } from '@/config/env';
import * as Sentry from '@sentry/react-native';

let isInitialized = false;

/**
 * Инициализирует Sentry / GlitchTip SDK для отслеживания ошибок и падений.
 * Должен вызываться как можно раньше до рендера приложения (в app/_layout.tsx).
 */
export function initLogger(): void {
  if (isInitialized) return;

  if (!GLITCHTIP_DSN || GLITCHTIP_DSN.trim() === '') {
    return;
  }

  try {
    Sentry.init({
      dsn: GLITCHTIP_DSN.trim(),
      // В режиме разработки не спамим лишними логами SDK
      debug: false,
      // Включаем трекинг сессий (crash-free users %)
      enableAutoSessionTracking: true,
      // Обязательно прикрепляем стектрейс ко всем ошибкам
      attachStacktrace: true,
      // Процент трассировок производительности
      tracesSampleRate: __DEV__ ? 1.0 : 0.2,
      // Фильтруем приватные данные перед отправкой
      beforeSend(event) {
        // Убираем возможные заголовки авторизации из отчётов
        if (event.request?.headers) {
          delete event.request.headers['Authorization'];
          delete event.request.headers['authorization'];
        }
        return event;
      },
    });

    isInitialized = true;
  } catch (err) {
    
  }
}

/**
 * Логирует ошибку (JS Exception или неизвестную ошибку) в GlitchTip.
 */
export function captureException(
  error: unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: Sentry.SeverityLevel;
  }
): void {
  if (!isInitialized) {
    if (__DEV__) {
      console.warn('[Logger] captureException (без DSN):', error, context);
    }
    return;
  }

  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    if (context?.level) {
      scope.setLevel(context.level);
    }
    Sentry.captureException(error);
  });
}

/**
 * Отправляет текстовое сообщение/предупреждение в GlitchTip.
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = 'info',
  extra?: Record<string, unknown>
): void {
  if (!isInitialized) {
    if (__DEV__) {
      console.log(`[Logger] [${level}] ${message}`, extra);
    }
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel(level);
    if (extra) {
      Object.entries(extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureMessage(message);
  });
}

/**
 * Добавляет «хлебную крошку» (действие пользователя) в таймлайн перед ошибкой.
 */
export function addBreadcrumb(breadcrumb: {
  category: string;
  message: string;
  data?: Record<string, unknown>;
  level?: Sentry.SeverityLevel;
}): void {
  if (!isInitialized) return;

  Sentry.addBreadcrumb({
    category: breadcrumb.category,
    message: breadcrumb.message,
    data: breadcrumb.data,
    level: breadcrumb.level || 'info',
  });
}

/**
 * Привязывает текущего пользователя к сессии (чтобы в GlitchTip можно было искать ошибки конкретного клиента).
 */
export function setLoggerUser(user: {
  id: string | number;
  phone?: string;
  username?: string;
  email?: string;
} | null): void {
  if (!isInitialized) return;

  if (!user) {
    Sentry.setUser(null);
  } else {
    Sentry.setUser({
      id: String(user.id),
      username: user.username,
      email: user.email,
    });
  }
}

export { Sentry };
