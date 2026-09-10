import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BookingModal } from '@/components/modals/BookingModal';
import { usePushNotifications } from '@/hooks/userPushNotifications';
import { useAuthStore } from '@/store/useAuthStore';
import { bookingBlurTargetRef } from '@/store/useBookingModalStore';
import { BlurTargetView } from 'expo-blur';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
  const { isLoading, isAuthenticated, checkAuth } = useAuthStore();

  const [fontsLoaded] = useFonts({
    'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
  });

  usePushNotifications(isAuthenticated);
  useEffect(() => {
    checkAuth(); // Проверяем, есть ли сохраненный токен
  }, [checkAuth]);

  if (isLoading || !fontsLoaded) {
    return <LoadingSpinner />;
  }

  return (
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
                headerTitleStyle: { fontFamily: 'Montserrat-Medium', color: '#172933' },
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
  );
}
