import type { Service } from '@/types/service';

/**
 * @deprecated Демо-услуги удалены для продакшена.
 * Список услуг загружается напрямую через API (GET /services).
 * При сбое сети или ошибке авторизации интерфейс отображает понятную ошибку
 * с кнопкой повторной попытки.
 */
export const DEFAULT_SERVICES: Service[] = [];

