import { pushAPI } from '@/api/push';
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

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
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

    registerForPushNotifications().then(setExpoPushToken);

    const notificationListener = Notifications.addNotificationReceivedListener((n) => {
      setNotification(n);
      addNotificationToStore(n);
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response, handledResponseIds.current);
    });

    Notifications.getLastNotificationResponseAsync().then(response => {
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
  const data = content.data as Record<string, unknown> | undefined;
  const hasServerId = data?.messageId ?? data?.message_id ?? data?.id;
  const messageId = hasServerId ?? `local:${notification.request.identifier}`;
  const title = typeof data?.title === 'string' ? data.title : content.title;
  const body = typeof data?.body === 'string' ? data.body : content.body;
  if (!title || !body) return String(messageId);

  const category = data?.category;
  const store = useMessageStore.getState();
  if (store.messages.some((message) => String(message.id) === String(messageId))) return String(messageId);

  const richContent = data?.richContent as Record<string, unknown> | undefined;
  const rawBanner = (typeof data?.banner === 'string'
    ? (() => {
        try {
          return JSON.parse(data.banner as string);
        } catch {
          return undefined;
        }
      })()
    : data?.banner) as Record<string, unknown> | undefined;

  const rawAttachments = (content as Record<string, unknown>).attachments;
  const attachmentUrl = Array.isArray(rawAttachments) && rawAttachments[0]?.url
    ? (rawAttachments[0].url as string)
    : undefined;

  const imageUrl =
    rawBanner?.image_url ??
    rawBanner?.image ??
    data?.image_url ??
    data?.imageUrl ??
    data?.image ??
    data?.picture ??
    data?.banner_url ??
    richContent?.image ??
    attachmentUrl;

  const bannerObj =
    (typeof imageUrl === 'string' && imageUrl) || rawBanner
      ? {
          image_url: typeof imageUrl === 'string' ? imageUrl : undefined,
          title: typeof rawBanner?.title === 'string' ? rawBanner.title : undefined,
          subtitle: typeof rawBanner?.subtitle === 'string' ? rawBanner.subtitle : undefined,
          button_text: typeof rawBanner?.button_text === 'string' ? rawBanner.button_text : undefined,
          bg_color: typeof rawBanner?.bg_color === 'string' ? rawBanner.bg_color : undefined,
        }
      : undefined;

  store.addMessage({
    id: String(messageId),
    category: category === 'promo' || category === 'info' ? category : ('system' as MessageCategory),
    title,
    body,
    image_url: typeof imageUrl === 'string' ? imageUrl : undefined,
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

  const expoPushToken = (await Notifications.getExpoPushTokenAsync(
    {
     projectId: 'c275c99b-f1f1-4842-b1f8-d8acb43ab83c',
  }
  )).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  await storage.setItem(STORAGE_KEYS.EXPO_PUSH_TOKEN, expoPushToken);

  const deviceId = await getDeviceId();
  await pushAPI
    .registerToken(deviceId, expoPushToken, Platform.OS === 'ios' ? 'ios' : 'android')
    .catch(() => {});
  return expoPushToken;
}
