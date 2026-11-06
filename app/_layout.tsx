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
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

// Инициализируем GlitchTip / Sentry до монтирования компонентов
initLogger();

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 350, fade: true });

function RootLayout() {
  const { isLoading, isAuthenticated, checkAuth } = useAuthStore();
  const [startupAnimationComplete, setStartupAnimationComplete] = useState(false);
  const nativeSplashHidden = useRef(false);

  const [fontsLoaded] = useFonts({
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  usePushNotifications(isAuthenticated);
  useEffect(() => {
    checkAuth(); // Проверяем, есть ли сохраненный токен
  }, [checkAuth]);

  const hideNativeSplash = useCallback(() => {
    if (nativeSplashHidden.current) {
      return;
    }

    nativeSplashHidden.current = true;
    SplashScreen.hide();
  }, []);

  const completeStartupAnimation = useCallback(() => {
    setStartupAnimationComplete(true);
  }, []);

  if (isLoading || !fontsLoaded || !startupAnimationComplete) {
    return (
      <StartupSplash
        fontsLoaded={fontsLoaded}
        onAnimationComplete={completeStartupAnimation}
        onLayout={hideNativeSplash}
      />
    );
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
      </View>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
