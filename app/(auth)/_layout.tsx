import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Добро пожаловать' }} />
      <Stack.Screen name="phone" options={{ title: 'Вход' }} />
      <Stack.Screen name="max-link" options={{ title: 'Подтверждение в MAX' }} />
      <Stack.Screen name="verify" options={{ title: 'Подтверждение' }} />
    </Stack>
  );
}
