import { API_URL } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

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
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Обрабатываем ответы и ошибки
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Токен истёк — очищаем и уведомляем приложение
      await AsyncStorage.removeItem('access_token');
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
    const data = error.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}
