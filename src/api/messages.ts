import type { Message } from '@/types/message';
import { api } from './client';

export const messagesAPI = {
  /** Список сообщений текущего пользователя */
  getList: () => api.get<Message[]>('/messages'),

  /** Сообщение по id */
  getById: (id: string) => api.get<Message>(`/messages/${id}`),

  /** Отметить сообщение прочитанным */
  markRead: (id: string) => api.patch<{ success: boolean }>(`/messages/${id}/read`),

  /** Отметить все сообщения прочитанными */
  markAllRead: () => api.patch<{ success: boolean }>('/messages/read-all'),
};
