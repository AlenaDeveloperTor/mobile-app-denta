import { messagesAPI } from '@/api/messages';
import type { Message } from '@/types/message';
import { create } from 'zustand';

interface MessageState {
  messages: Message[];
  messageAliases: Record<string, string>;
  loading: boolean;
  /** Счётчик непрочитанных (из бэкенда или локальный) */
  unreadCount: number;
  /** Загрузить сообщения (с фоллбэком на демо-данные) */
  load: () => Promise<void>;
  /** Загрузить сообщение по id, если его ещё нет в списке */
  loadMessage: (id: string) => Promise<void>;
  resolveMessageId: (id: string) => string;
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

function normalizeMessage(message: Message): Message {
  const imageUrl = message.banner?.image_url ?? message.image_url;
  const banner = imageUrl
    ? { ...message.banner, image_url: imageUrl }
    : message.banner;
  const isAppointment =
    message.deep_link === 'app://appointments' ||
    /записан|запись в клинику|запись подтверждена/i.test(`${message.title} ${message.body}`);

  return isAppointment && message.category === 'promo'
    ? { ...message, banner, category: 'system' }
    : { ...message, banner };
}

function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort((left, right) => {
    const rightTime = Date.parse(right.created_at);
    const leftTime = Date.parse(left.created_at);
    return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
  });
}

function isLocalMessage(message: Message): boolean {
  return typeof message.id === 'string' && message.id.startsWith('local:');
}

function samePush(left: Message, right: Message): boolean {
  const leftTime = Date.parse(left.created_at);
  const rightTime = Date.parse(right.created_at);
  const closeInTime =
    !Number.isNaN(leftTime) &&
    !Number.isNaN(rightTime) &&
    Math.abs(leftTime - rightTime) <= 10 * 60 * 1000;
  return (
    isLocalMessage(left) &&
    closeInTime &&
    String(left.title ?? '').trim() === String(right.title ?? '').trim() &&
    String(left.body ?? '').trim() === String(right.body ?? '').trim()
  );
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  messageAliases: {},
  loading: false,
  unreadCount: 0,

  load: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await messagesAPI.getList();
      const data = res.data;
      const items = (data.items ?? []).map(normalizeMessage);
      const unreadCount =
        data.unread_count ?? items.filter((m) => !m.is_read).length;
      set((state) => {
        const serverIds = new Set(items.map((item) => String(item.id)));
        const aliases = { ...state.messageAliases };
        const localOnly = state.messages.filter((item) => {
          if (serverIds.has(String(item.id))) return false;
          const serverMatch = items.find((serverItem) => samePush(item, serverItem));
          if (serverMatch && isLocalMessage(item)) {
            aliases[item.id] = String(serverMatch.id);
            return false;
          }
          return true;
        });
        return {
          messages: sortMessages([...localOnly, ...items]),
          messageAliases: aliases,
          unreadCount: unreadCount + localOnly.filter((item) => !item.is_read).length,
          loading: false,
        };
      });
    } catch (error) {
      // API недоступен — не подменяем реальные уведомления тестовыми данными.
      console.warn('Не удалось загрузить сообщения:', error);
      set((state) => ({
        messages: state.messages,
        unreadCount: state.messages.filter((m) => !m.is_read).length,
        loading: false,
      }));
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

  loadMessage: async (id) => {
    const resolvedId = get().messageAliases[id] ?? id;
    if (get().messages.some((message) => String(message.id) === String(resolvedId))) {
      return;
    }
    try {
      const res = await messagesAPI.getById(id);
      const message = normalizeMessage(res.data);
      set((state) => ({
        messages: state.messages.some((item) => String(item.id) === String(message.id))
          ? state.messages
          : [message, ...state.messages],
      }));
    } catch {
      // Экран деталей покажет понятное состояние, если сообщение уже удалено.
    }
  },

  resolveMessageId: (id) => get().messageAliases[id] ?? id,

  markAsRead: (id) => {
    set((state) => {
      const msg = state.messages.find((m) => String(m.id) === String(id));
      const wasUnread = msg && !msg.is_read;
      return {
        messages: state.messages.map((m) =>
          String(m.id) === String(id) ? { ...m, is_read: true } : m
        ),
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
      messages: sortMessages([
        normalizeMessage(message),
        ...state.messages.filter((item) => !samePush(item, message)),
      ]),
      unreadCount: message.is_read ? state.unreadCount : state.unreadCount + 1,
    })),

  setMessages: (items) => set({ messages: sortMessages(items.map(normalizeMessage)) }),

  clear: () => set({ messages: [], loading: false, unreadCount: 0 }),
}));
