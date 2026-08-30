import { STORAGE_KEYS } from './constants';
import { storage } from './storage';

/**
 * Возвращает стабильный идентификатор установки приложения (device_id).
 *
 * - Читает из AsyncStorage; если ещё нет — генерирует UUID и сохраняет.
 * - Остаётся прежним между запусками и входами/выходами пользователя.
 * - Сбрасывается только при переустановке приложения (AsyncStorage очищается).
 */
export async function getDeviceId(): Promise<string> {
  const existing = await storage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (existing) {
    return existing;
  }

  const id = generateUUID();
  await storage.setItem(STORAGE_KEYS.DEVICE_ID, id);
  return id;
}

/** Генерация UUID v4 без внешних зависимостей */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
