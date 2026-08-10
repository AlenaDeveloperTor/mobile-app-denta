/** Категория сообщения — влияет на иконку и содержимое детального просмотра */
export type MessageCategory = 'general' | 'promo' | 'news' | 'appointment';

/** Баннер внутри сообщения (акция, новость и т.п.) */
export interface MessageBanner {
  image_url?: string;
  /** Запасной цвет фона баннера, если картинка не загрузилась */
  bg_color?: string;
  button_text?: string;
}

/**
 * Сущность «Сообщение» — пуш-уведомление, акция, новость.
 * Может содержать вложенный баннер для детального просмотра.
 */
export interface Message {
  id: string;
  category: MessageCategory;
  title: string;
  body: string;
  /** Прочитано ли сообщение */
  is_read: boolean;
  /** ISO-дата создания */
  created_at: string;
  banner?: MessageBanner;
}
