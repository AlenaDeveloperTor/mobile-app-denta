import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { styles } from '@/styles/verify';
import { isValidCode } from '@/utils/validators';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

/** Сообщения для стандартизированных ошибок авторизации */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_CODE: 'Неверный код. Попробуйте ещё раз.',
  SESSION_NOT_FOUND: 'Сессия истекла. Запросите код заново.',
};

export default function VerifyScreen() {
  const { phone, session_id } = useLocalSearchParams<{ phone?: string; session_id?: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyCode } = useAuthStore();

  const handleVerify = async () => {
    if (!isValidCode(code)) {
      Alert.alert('Ошибка', 'Введите корректный код');
      return;
    }
    if (!session_id) {
      Alert.alert('Ошибка', 'Идентификатор сессии не указан');
      return;
    }

    setLoading(true);
    try {
      await verifyCode(session_id, code.trim());
      router.replace('/(tabs)');
    } catch (error) {
      // Распознаём стандартизированную ошибку сервера
      const apiCode = axios.isAxiosError(error)
        ? (error.response?.data as { code?: string } | undefined)?.code
        : undefined;
      Alert.alert(
        'Ошибка',
        AUTH_ERROR_MESSAGES[apiCode ?? ''] ?? 'Не удалось подтвердить код. Попробуйте ещё раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подтверждение</Text>
      <Text style={styles.subtitle}>
        Введите код из чата с ботом MAX{phone ? ` для номера ${phone}` : ''}
      </Text>

      <Input
        label="Код из MAX"
        value={code}
        onChangeText={(text) => setCode(text.replace(/\D/g, '').slice(0, 4))}
        placeholder="0000"
        keyboardType="number-pad"
        maxLength={4}
      />

      <Button
        title={loading ? 'Проверка...' : 'Подтвердить'}
        onPress={handleVerify}
        loading={loading}
      />
      <Button title="Назад" variant="secondary" onPress={() => router.back()} />
    </View>
  );
}
