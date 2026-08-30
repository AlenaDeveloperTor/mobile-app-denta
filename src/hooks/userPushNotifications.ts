import { pushAPI } from '@/api/push';
import { STORAGE_KEYS } from '@/utils/constants';
import { getDeviceId } from '@/utils/device';
import { storage } from '@/utils/storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Регистрирует устройство для push-уведомлений и возвращает токен */
export function usePushNotifications(enabled = true) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const handledResponseIds = useRef(new Set<string>());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    registerForPushNotifications().then(setExpoPushToken);

    const notificationListener = Notifications.addNotificationReceivedListener(n =>
      setNotification(n)
    );
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

  const data = response.notification.request.content.data as Record<string, unknown> | undefined;
  const messageId = data?.messageId ?? data?.id;

  if (typeof messageId === 'string') {
    router.push({
      pathname: '/notifications',
      params: { messageId },
    });
    return;
  }

  const url = data?.url;
  if (typeof url === 'string') {
    router.push(url as never);
  }
}

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
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
