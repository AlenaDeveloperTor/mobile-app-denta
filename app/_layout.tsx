import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { StartupSplash } from '@/components/common/StartupSplash';
import { BookingModal } from '@/components/modals/BookingModal';
import { FONT } from '@/constants/theme';
import { usePushNotifications } from '@/hooks/userPushNotifications';
import { useAuthStore } from '@/store/useAuthStore';
import { bookingBlurTargetRef } from '@/store/useBookingModalStore';
import { initLogger, Sentry } from '@/utils/logger';
import { BlurTargetView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

// Инициализируем GlitchTip / Sentry до монтирования компонентов
initLogger();

// Удерживаем нативный сплэш до монтирования JS-компонента
void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 180, fade: true });

function RootLayout() {
  const { isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const [splashVisible, setSplashVisible] = useState(true);
  const [safetyTimeoutReached, setSafetyTimeoutReached] = useState(false);

  const [fontsLoaded] = useFonts({
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  usePushNotifications(isAuthenticated);

  useEffect(() => {
    checkAuth(); // Проверяем, есть ли сохраненный токен
  }, [checkAuth]);

  // Гарантированное скрытие системного нативного сплэша
  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => {});
    const timer = setTimeout(() => {
      void SplashScreen.hideAsync().catch(() => {});
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Страховочный таймер: максимум 2.6 секунды на сплэш,
  // чтобы приложение НИКОГДА не зависло, даже если сервер не отвечает или нет сети
  useEffect(() => {
    const timer = setTimeout(() => {
      setSafetyTimeoutReached(true);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  const isAppReady = (!isLoading && fontsLoaded) || safetyTimeoutReached;

  // Если шрифты еще не загрузились и страховочный таймаут не вышел,
  // рендерим сплэш без монтирования экранов с текстом
  if (!fontsLoaded && !safetyTimeoutReached) {
    return <StartupSplash isReady={false} />;
  }

  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        {/* BlurTargetView нужен, чтобы BlurView в оверлее записи размывал экраны под собой (Android) */}
        <BlurTargetView ref={bookingBlurTargetRef} style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="appointment-success" />
              <Stack.Screen
                name="notifications"
                options={{
                  headerShown: true,
                  title: 'Уведомления',
                  headerStyle: { backgroundColor: '#F5F8FC' },
                  headerTitleStyle: { fontFamily: FONT.medium, color: '#172933' },
                }}
              />
            </Stack.Protected>
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
          </Stack>
        </BlurTargetView>

        {/* Глобальная модалка записи — поверх всех экранов */}
        <BookingModal />

        {/* Анимированный сплэш поверх основного контента с плавным растворением */}
        {splashVisible && (
          <StartupSplash
            isReady={isAppReady}
            onFinish={() => setSplashVisible(false)}
          />
        )}
      </View>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
