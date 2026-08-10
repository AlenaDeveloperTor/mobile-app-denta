import type { Message } from '@/types/message';

/**
 * Демо-сообщения для тестирования раздела уведомлений.
 *
 * Используются как запасной вариант, когда API (GET /messages) ещё не вернул
 * сообщения или недоступен.
 *
 * Как заменить на реальные данные:
 *  1) Через бэкенд — создавайте записи в коллекции/таблице сообщений,
 *     они придут в приложение автоматически (обычно бэкенд создаёт их
 *     при отправке push-уведомления).
 *  2) Локально — отредактируйте этот массив.
 */
export const DEFAULT_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    category: 'promo',
    title: 'Скидка 20% на имплантацию',
    body: 'Только до конца месяца. Запишитесь на консультацию и узнайте точную стоимость под вашу ситуацию.',
    is_read: false,
    created_at: '2026-08-09T10:00:00.000Z',
    banner: {
      image_url: 'https://picsum.photos/seed/denta-imp/800/400',
      bg_color: '#0A7DFF',
      button_text: 'Записаться',
    },
  },
  {
    id: 'msg-2',
    category: 'news',
    title: 'Новые часы работы клиники',
    body: 'С сентября клиника работает ежедневно с 8:00 до 21:00. Запись — онлайн или по телефону.',
    is_read: false,
    created_at: '2026-08-08T09:00:00.000Z',
    banner: {
      image_url: 'https://picsum.photos/seed/denta-news/800/400',
      bg_color: '#2E7D32',
      button_text: 'Подробнее',
    },
  },
  {
    id: 'msg-3',
    category: 'appointment',
    title: 'Запись подтверждена',
    body: 'Ваша запись на 10:00 подтверждена. Приходите за 10 минут до начала приёма.',
    is_read: true,
    created_at: '2026-08-07T12:30:00.000Z',
  },
  {
    id: 'msg-4',
    category: 'promo',
    title: 'Бесплатная диагностика',
    body: 'При первом посещении клиники — КТ и 3D-снимок в подарок.',
    is_read: false,
    created_at: '2026-08-06T14:00:00.000Z',
    banner: {
      image_url: 'https://picsum.photos/seed/denta-ct/800/400',
      bg_color: '#FF6B35',
      button_text: 'Записаться',
    },
  },
  {
    id: 'msg-5',
    category: 'general',
    title: 'Добро пожаловать!',
    body: 'Спасибо, что выбрали нашу клинику. Здесь будут появляться уведомления о записях и акциях.',
    is_read: true,
    created_at: '2026-08-05T08:00:00.000Z',
  },
];
