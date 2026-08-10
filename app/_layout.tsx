import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BookingModal } from '@/components/modals/BookingModal';
import { useAuthStore } from '@/store/useAuthStore';
import { bookingBlurTargetRef } from '@/store/useBookingModalStore';
import { BlurTargetView } from 'expo-blur';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
  const { isLoading, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Проверяем, есть ли сохраненный токен
  }, [checkAuth]);

  if (isLoading) {
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
            <Stack.Screen name="notifications" options={{ headerShown: true, title: 'Уведомления' }} />
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

