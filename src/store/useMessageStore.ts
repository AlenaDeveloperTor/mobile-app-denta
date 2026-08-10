import { messagesAPI } from '@/api/messages';
import { DEFAULT_MESSAGES } from '@/data/messages';
import type { Message } from '@/types/message';
import { create } from 'zustand';

interface MessageState {
  messages: Message[];
  loading: boolean;
  /** Загрузить сообщения (с фоллбэком на демо-данные) */
  load: () => Promise<void>;
  /** Отметить сообщение прочитанным (локально + fire-and-forget на бэкенд) */
  markAsRead: (id: string) => void;
  /** Отметить все прочитанными */
  markAllRead: () => void;
  /** Добавить сообщение в начало списка (например, при получении push) */
  addMessage: (message: Message) => void;
  setMessages: (items: Message[]) => void;
  clear: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  loading: false,

  load: async () => {
    set({ loading: true });
    try {
      const res = await messagesAPI.getList();
      const items = res.data.length > 0 ? res.data : DEFAULT_MESSAGES;
      set({ messages: items, loading: false });
    } catch (error) {
      // API недоступен — показываем демо-сообщения, чтобы раздел можно было протестировать
      console.warn('Не удалось загрузить сообщения, показываем демо:', error);
      set({ messages: DEFAULT_MESSAGES, loading: false });
    }
  },

  markAsRead: (id) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
    }));
    messagesAPI.markRead(id).catch(() => {});
  },

  markAllRead: () => {
    set((state) => ({
      messages: state.messages.map((m) => ({ ...m, is_read: true })),
    }));
    messagesAPI.markAllRead().catch(() => {});
  },

  addMessage: (message) =>
    set((state) => ({ messages: [message, ...state.messages] })),

  setMessages: (items) => set({ messages: items }),

  clear: () => set({ messages: [], loading: false }),
}));
