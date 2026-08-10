import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { styles } from '@/styles/phone';
import { formatPhoneInput, normalizePhone } from '@/utils/formatters';
import { isValidPhone } from '@/utils/validators';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function PhoneScreen() {
  const [phone, setPhone] = useState('+7');
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
      const res = await requestCode(normalized);
      if (res.message) {
        Alert.alert('', res.message);
      }
      // Новый пользователь — нужно перейти в MAX по диплинку
      if (res.status === 'need_redirect') {
        router.push({
          pathname: '/(auth)/max-link',
          params: {
            phone: normalized,
            session_id: res.session_id,
            deep_link: res.deep_link ?? '',
          },
        });
        return;
      }
      // Код уже отправлен в чат MAX — идём на экран ввода кода
      router.push({
        pathname: '/(auth)/verify',
        params: { phone: normalized, session_id: res.session_id },
      });
      return;
    } catch (error) {
      // В продакшене при неудаче показываем ошибку и не идём дальше
      if (!__DEV__) {
        Alert.alert('Ошибка', 'Не удалось отправить код. Попробуйте позже.');
        return;
      }
      // В dev-сборке (без бэкенда) переходим на экран привязки в MAX
      console.warn('[dev] Не удалось отправить код, переходим к привязке MAX:', error);
      router.push({
        pathname: '/(auth)/max-link',
        params: { phone: normalized },
      });
      return;
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
        onChangeText={(text) => setPhone(formatPhoneInput(text))}
        placeholder="+7 (999) 123-45-67"
        keyboardType="phone-pad"
        maxLength={18}
      />

      <Button
        title={loading ? 'Отправка...' : 'Получить код'}
        onPress={handleRequestCode}
        loading={loading}
      />
    </View>
  );
}
