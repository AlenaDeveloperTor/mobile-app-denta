import { Button } from '@/components/common/Button';
import { styles } from '@/styles/welcome';
import { APP_NAME } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Ionicons name="medkit-outline" size={48} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.subtitle}>
        Запись к стоматологу, бонусная программа и акции — в одном приложении.
      </Text>

      <Button title="Авторизоваться" onPress={() => router.push('/(auth)/phone')} />

      <Text style={styles.hint}>Продолжая, вы соглашаетесь с условиями обработки данных</Text>
    </View>
  );
}
