import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { normalizePhone } from '@/utils/formatters';
import { isValidPhone } from '@/utils/validators';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { styles } from './phone.styles';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestCode } = useAuthStore();

  const handleRequestCode = async () => {
    if (!isValidPhone(phone)) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона');
      return;
    }

    const normalized = normalizePhone(phone);
    setLoading(true);
    try {
      await requestCode(normalized);
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: normalized },
      });
    } catch {
      Alert.alert('Ошибка', 'Не удалось отправить код. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход в приложение</Text>
      <Text style={styles.subtitle}>Введите номер телефона</Text>

      <Input
        label="Телефон"
        value={phone}
        onChangeText={(text) => setPhone(normalizePhone(text))}
        placeholder="+7 (999) 123-45-67"
        keyboardType="phone-pad"
      />

      <Button
        title={loading ? 'Отправка...' : 'Получить код'}
        onPress={handleRequestCode}
        loading={loading}
      />
    </View>
  );
}
