import { pushAPI } from '@/api/push';
import { EAS_PROJECT_ID } from '@/config/env';
import { STORAGE_KEYS } from '@/utils/constants';
import { getDeviceId } from '@/utils/device';
import { storage } from '@/utils/storage';
import { useMessageStore } from '@/store/useMessageStore';
import type { MessageCategory } from '@/types/message';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { z } from 'zod';

const pushBannerSchema = z.object({
  image_url: z.string().optional(),
  image: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  button_text: z.string().optional(),
  bg_color: z.string().optional(),
});

const pushPayloadSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  messageId: z.union([z.string(), z.number()]).optional(),
  message_id: z.union([z.string(), z.number()]).optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  category: z.enum(['promo', 'info', 'system']).optional(),
  image_url: z.string().optional(),
  imageUrl: z.string().optional(),
  image: z.string().optional(),
  picture: z.string().optional(),
  banner_url: z.string().optional(),
  banner: z.union([z.string(), pushBannerSchema]).optional(),
  richContent: z.object({
    image: z.string().optional(),
  }).optional(),
}).passthrough();

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

/** Регистрирует устройство для push-уведомлений и возвращает токен */
export function usePushNotifications(enabled = true) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const handledResponseIds = useRef(new Set<string>());

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') {
      return;
    }

    registerForPushNotifications()
      .then(setExpoPushToken)
      .catch((err) => {
        // Ошибка регистрации push (симулятор, отказ в правах или отсутствие сети)
        console.warn('Не удалось зарегистрировать push-уведомления:', err);
      });

    const notificationListener = Notifications.addNotificationReceivedListener((n) => {
      setNotification(n);
      addNotificationToStore(n);
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response, handledResponseIds.current);
    });

    Notifications.getLastNotificationResponseAsync().catch(() => null).then(response => {
      if (response) {
        handleNotificationResponse(response, handledResponseIds.current);
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [enabled]);

  return { expoPushToken, notification };
}

function handleNotificationResponse(
  response: Notifications.NotificationResponse,
  handledResponseIds: Set<string>
) {
  const responseId = response.notification.request.identifier;
  if (handledResponseIds.has(responseId)) {
    return;
  }
  handledResponseIds.add(responseId);

  const messageId = addNotificationToStore(response.notification);
  router.push({
    pathname: '/notifications',
    params: { messageId },
  });
}

function addNotificationToStore(notification: Notifications.Notification): string {
  const content = notification.request.content;
  const parsed = pushPayloadSchema.safeParse(content.data ?? {});
  const data = parsed.success ? parsed.data : {};

  const hasServerId = data.messageId ?? data.message_id ?? data.id;
  const messageId = hasServerId ? String(hasServerId) : `local:${notification.request.identifier}`;
  const title = (typeof data.title === 'string' && data.title) || content.title;
  const body = (typeof data.body === 'string' && data.body) || content.body;
  if (!title || !body) return String(messageId);

  const category = data.category;
  const store = useMessageStore.getState();
  if (store.messages.some((message) => String(message.id) === String(messageId))) return String(messageId);

  let rawBanner: z.infer<typeof pushBannerSchema> | undefined;
  if (typeof data.banner === 'string') {
    try {
      const json = JSON.parse(data.banner);
      const bannerParsed = pushBannerSchema.safeParse(json);
      if (bannerParsed.success) rawBanner = bannerParsed.data;
    } catch {
      // Игнорируем ошибку JSON-парсинга
    }
  } else if (data.banner && typeof data.banner === 'object') {
    rawBanner = data.banner;
  }

  const rawAttachments = (content as Record<string, unknown>).attachments;
  const attachmentUrl = Array.isArray(rawAttachments) && typeof rawAttachments[0]?.url === 'string'
    ? rawAttachments[0].url
    : undefined;

  const imageUrl =
    rawBanner?.image_url ??
    rawBanner?.image ??
    data.image_url ??
    data.imageUrl ??
    data.image ??
    data.picture ??
    data.banner_url ??
    data.richContent?.image ??
    attachmentUrl;

  const bannerObj =
    imageUrl || rawBanner
      ? {
          image_url: imageUrl,
          title: rawBanner?.title,
          subtitle: rawBanner?.subtitle,
          button_text: rawBanner?.button_text,
          bg_color: rawBanner?.bg_color,
        }
      : undefined;

  store.addMessage({
    id: String(messageId),
    category: category === 'promo' || category === 'info' ? category : ('system' as MessageCategory),
    title,
    body,
    image_url: imageUrl,
    banner: bannerObj,
    is_read: false,
    created_at: new Date().toISOString(),
  });
  return String(messageId);
}

async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web' || !Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#AAC6EE',
    });
  }

  const expoPushToken = (
    await Notifications.getExpoPushTokenAsync({
      projectId: EAS_PROJECT_ID,
    })
  ).data;



  await storage.setItem(STORAGE_KEYS.EXPO_PUSH_TOKEN, expoPushToken);

  const deviceId = await getDeviceId();
  await pushAPI
    .registerToken(deviceId, expoPushToken, Platform.OS === 'ios' ? 'ios' : 'android')
    .then(() => {
      console.log('[Push] Токен успешно зарегистрирован на сервере');
    })
    .catch((err) => {
      console.error('[Push] Ошибка регистрации токена на сервере:', err);
    });
  return expoPushToken;
}
