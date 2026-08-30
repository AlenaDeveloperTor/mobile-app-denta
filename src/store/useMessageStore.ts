import { messagesAPI } from '@/api/messages';
import { DEFAULT_MESSAGES } from '@/data/messages';
import type { Message } from '@/types/message';
import { create } from 'zustand';

interface MessageState {
  messages: Message[];
  loading: boolean;
  /** Счётчик непрочитанных (из бэкенда или локальный) */
  unreadCount: number;
  /** Загрузить сообщения (с фоллбэком на демо-данные) */
  load: () => Promise<void>;
  /** Загрузить только счётчик непрочитанных (лёгкий запрос для бейджа) */
  loadUnreadCount: () => Promise<void>;
  /** Отметить сообщение прочитанным (локально + fire-and-forget на бэкенд) */
  markAsRead: (id: string) => void;
  /** Отметить все прочитанными */
  markAllRead: () => void;
  /** Добавить сообщение в начало списка (например, при получении push) */
  addMessage: (message: Message) => void;
  setMessages: (items: Message[]) => void;
  clear: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  loading: false,
  unreadCount: 0,

  load: async () => {
    set({ loading: true });
    try {
      const res = await messagesAPI.getList();
      const data = res.data;
      const items = data.items && data.items.length > 0 ? data.items : DEFAULT_MESSAGES;
      const unreadCount =
        data.unread_count ?? items.filter((m) => !m.is_read).length;
      set({ messages: items, unreadCount, loading: false });
    } catch (error) {
      // API недоступен — показываем демо-сообщения, чтобы раздел можно было протестировать
      console.warn('Не удалось загрузить сообщения, показываем демо:', error);
      const fallback = DEFAULT_MESSAGES;
      set({
        messages: fallback,
        unreadCount: fallback.filter((m) => !m.is_read).length,
        loading: false,
      });
    }
  },

  loadUnreadCount: async () => {
    try {
      const res = await messagesAPI.getUnreadCount();
      set({ unreadCount: res.data.count });
    } catch {
      // Если эндпоинт недоступен — считаем локально
      const { messages } = get();
      set({ unreadCount: messages.filter((m) => !m.is_read).length });
    }
  },

  markAsRead: (id) => {
    set((state) => {
      const msg = state.messages.find((m) => m.id === id);
      const wasUnread = msg && !msg.is_read;
      return {
        messages: state.messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    });
    messagesAPI.markRead(id).catch(() => {});
  },

  markAllRead: () => {
    set((state) => ({
      messages: state.messages.map((m) => ({ ...m, is_read: true })),
      unreadCount: 0,
    }));
    messagesAPI.markAllRead().catch(() => {});
  },

  addMessage: (message) =>
    set((state) => ({
      messages: [message, ...state.messages],
      unreadCount: message.is_read ? state.unreadCount : state.unreadCount + 1,
    })),

  setMessages: (items) => set({ messages: items }),

  clear: () => set({ messages: [], loading: false, unreadCount: 0 }),
}));
