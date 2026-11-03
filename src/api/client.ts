import { API_URL } from '@/config/env';
import { captureException } from '@/utils/logger';
import { storage } from '@/utils/storage';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Реестр обработчика на 401 — регистрируется из приложения/стора (без циклических зависимостей)
type UnauthorizedHandler = () => void | Promise<void>;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

// Подставляем токен авторизации в каждый запрос
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Обновление access-токена через refresh-токен (single-flight) ---
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh-токен отсутствует');
      }
      // Прямой вызов axios (не через api), чтобы не зациклить интерцепторы
      const res = await axios.post<{
        access_token: string;
        refresh_token: string;
      }>(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });
      await storage.setTokens(res.data.access_token, res.data.refresh_token);
      return res.data.access_token;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Обрабатываем ответы и ошибки
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // 401 и ещё не пробовали обновить токен — пробуем refresh и повторяем запрос
    if (error.response?.status === 401 && original && !original._retry) {
      try {
        const token = await refreshAccessToken();
        original._retry = true;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        // Refresh не удался — сессия невалидна
        await storage.removeTokens();
        unauthorizedHandler?.();
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      // Повторный 401 — токены протухли, сбрасываем сессию
      await storage.removeTokens();
      unauthorizedHandler?.();
    }

    // Логируем в GlitchTip критические ошибки: 5xx бэкенда или сбои сети (offline/timeout)
    const status = error.response?.status;
    if (!status || status >= 500) {
      captureException(error, {
        tags: {
          error_type: 'api_error',
          endpoint: error.config?.url || 'unknown',
          method: error.config?.method?.toUpperCase() || 'unknown',
          status: status ? String(status) : 'NETWORK_ERROR',
        },
        extra: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          params: error.config?.params,
          status,

          message: error.message,
        },
      });
    }

    return Promise.reject(error);
  }
);

/** Возвращает человекочитаемое сообщение об ошибке (гарантированно строку) */
export function getErrorMessage(
  error: unknown,
  fallback = 'Произошла ошибка. Попробуйте ещё раз.'
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    if (data && typeof data === 'object') {
      const d = data as Record<string, unknown>;
      // Массив сообщений (например, валидационные ошибки NestJS / class-validator)
      if (Array.isArray(d.message)) {
        return d.message.filter(Boolean).map(String).join('\n') || fallback;
      }
      if (typeof d.message === 'string' && d.message.trim()) {
        return d.message;
      }
      if (typeof d.error === 'string' && d.error.trim()) {
        return d.error;
      }
      // Ошибки валидации FastAPI / Pydantic (массив detail: [{ loc: [...], msg: "..." }])
      if (Array.isArray(d.detail)) {
        const messages = d.detail
          .map((item: unknown) => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
              const err = item as { loc?: (string | number)[]; msg?: string };
              const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : '';
              return field ? `${field}: ${err.msg}` : err.msg;
            }
            return String(item);
          })
          .filter(Boolean);
        if (messages.length > 0) {
          return messages.join('\n');
        }
      }
      if (typeof d.detail === 'string' && d.detail.trim()) {
        return d.detail;
      }
      if (d.error && typeof d.error === 'object') {
        const nestedErr = d.error as Record<string, unknown>;
        if (typeof nestedErr.message === 'string' && nestedErr.message.trim()) {
          return nestedErr.message;
        }
      }
      if (typeof d.code === 'string' && d.code.trim()) {
        return d.code;
      }
    }
    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }
    return fallback;
  }
  if (error instanceof Error && typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }
  return fallback;
}
