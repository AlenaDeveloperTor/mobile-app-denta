import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { isValidCode } from '@/utils/validators';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { styles } from './verify.styles';

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyCode } = useAuthStore();

  const handleVerify = async () => {
    if (!isValidCode(code)) {
      Alert.alert('Ошибка', 'Введите корректный код');
      return;
    }
    if (!phone) {
      Alert.alert('Ошибка', 'Номер телефона не указан');
      return;
    }

    setLoading(true);
    try {
      await verifyCode(phone, code.trim());
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Ошибка', 'Неверный код. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подтверждение</Text>
      <Text style={styles.subtitle}>Мы отправили код на номер {phone}</Text>

      <Input
        label="Код из SMS"
        value={code}
        onChangeText={setCode}
        placeholder="0000"
        keyboardType="phone-pad"
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
