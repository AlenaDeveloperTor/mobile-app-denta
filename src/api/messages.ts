import type { Message } from '@/types/message';
import { api } from './client';

/** Ответ GET /messages — пагинированный список с количеством непрочитанных */
export interface MessagesListResponse {
  items: Message[];
  total: number;
  page: number;
  limit: number;
  unread_count: number;
}

export const messagesAPI = {
  /** Список сообщений текущего пользователя */
  getList: () => api.get<MessagesListResponse>('/messages'),

  /** Сообщение по id */
  getById: (id: string) => api.get<Message>(`/messages/${id}`),

  /** Отметить сообщение прочитанным */
  markRead: (id: string) => api.patch<{ success: boolean }>(`/messages/${id}/read`),

  /** Отметить все сообщения прочитанными */
  markAllRead: () => api.patch<{ success: boolean }>('/messages/read-all'),

  /** Количество непрочитанных сообщений (для бейджа на колокольчике) */
  getUnreadCount: () => api.get<{ count: number }>('/messages/unread-count'),
};
