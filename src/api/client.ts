import { API_URL } from '@/config/env';
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
type UnauthorizedHandler = () => void;
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
    return Promise.reject(error);
  }
);

/** Возвращает человекочитаемое сообщение об ошибке */
export function getErrorMessage(
  error: unknown,
  fallback = 'Произошла ошибка. Попробуйте ещё раз.'
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string; code?: string }
      | undefined;
    return data?.message || data?.error || data?.code || error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
