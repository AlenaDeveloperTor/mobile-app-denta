import { Button } from '@/components/common/Button';
import { styles } from '@/styles/welcome';
import { APP_NAME } from '@/utils/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Лого-кружок: иконка зуба на градиентном фоне */}
      <View style={styles.logoCircle}>
        <LinearGradient
          colors={['#AAC6EE', '#D0C8B5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="happy-outline" size={48} color="#172933" />
        </LinearGradient>
      </View>

      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.slogan}>Улыбки без драмы</Text>

      <Text style={styles.subtitle}>
        Запись к стоматологу, бонусная программа и акции — в одном приложении.
      </Text>

      <Button title="Авторизоваться" onPress={() => router.push('/(auth)/phone')} />

      <Text style={styles.hint}>Продолжая, вы соглашаетесь с условиями обработки данных</Text>
    </View>
  );
}
