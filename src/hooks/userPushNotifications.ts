import { pushAPI } from '@/api/push';
import { STORAGE_KEYS } from '@/utils/constants';
import { storage } from '@/utils/storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
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
export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    registerForPushNotifications().then(setExpoPushToken);

    const notificationListener = Notifications.addNotificationReceivedListener((n) =>
      setNotification(n)
    );
    const responseListener = Notifications.addNotificationResponseReceivedListener(() => {});

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return { expoPushToken, notification };
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

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  await storage.setItem(STORAGE_KEYS.FCM_TOKEN, token);
  await pushAPI
    .registerToken(token, Platform.OS === 'ios' ? 'ios' : 'android')
    .catch(() => {});
  return token;
}
