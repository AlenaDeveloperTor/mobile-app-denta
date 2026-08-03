import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

/** Типизированная обёртка над AsyncStorage */
export const storage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
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
