import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from './constants';

const isSecureStoreAvailable = Platform.OS !== 'web';

/**
 * Типизированная обёртка над хранилищем:
 * - Секретные токены (access_token, refresh_token) хранятся в expo-secure-store
 *   (iOS Keychain / Android Keystore с аппаратным шифрованием).
 * - Общие нечувствительные данные хранятся в AsyncStorage.
 */
export const storage = {
  /** Получает access-токен из SecureStore (с fallback миграцией из AsyncStorage) */
  async getToken(): Promise<string | null> {
    if (!isSecureStoreAvailable) {
      return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) return token;

      // Однократная миграция старых токенов из AsyncStorage в SecureStore
      const legacyToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (legacyToken) {
        await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, legacyToken);
        await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        return legacyToken;
      }
      return null;
    } catch {
      return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  },

  /** Получает refresh-токен из SecureStore (с fallback миграцией из AsyncStorage) */
  async getRefreshToken(): Promise<string | null> {
    if (!isSecureStoreAvailable) {
      return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      if (token) return token;

      // Миграция старого refresh-токена
      const legacyToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (legacyToken) {
        await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, legacyToken);
        await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        return legacyToken;
      }
      return null;
    } catch {
      return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  /** Сохраняет пару токенов (access + refresh) в защищённое хранилище SecureStore */
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    if (!isSecureStoreAvailable) {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      ]);
      return;
    }

    try {
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);
      // Удаляем остатки из AsyncStorage если они там были
      await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]).catch(() => {});
    } catch {
      // Fallback на AsyncStorage при ошибках Keychain/Keystore
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      ]);
    }
  },

  /** Удаляет пару токенов из SecureStore и AsyncStorage */
  async removeTokens(): Promise<void> {
    if (!isSecureStoreAvailable) {
      await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
      return;
    }

    await Promise.allSettled([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]),
    ]);
  },

  async getItem(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async getObject<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setObject(key: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
