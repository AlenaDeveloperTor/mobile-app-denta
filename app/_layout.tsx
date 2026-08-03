import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Проверяем, есть ли сохраненный токен
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Здесь будут автоматически подключаться экраны из папок */}
    </Stack>
  );
}