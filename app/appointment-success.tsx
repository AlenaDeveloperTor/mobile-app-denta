import { Button } from '@/components/common/Button';
import { styles } from '@/styles/appointmentSuccess';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentSuccessScreen() {
  return (
    <View style={styles.container}>
      {/* Иконка-кружок с градиентом вместо зелёного */}
      <View style={styles.iconCircle}>
        <LinearGradient
          colors={['#AAC6EE', '#D0C8B5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="checkmark" size={52} color="#172933" />
        </LinearGradient>
      </View>
      <Text style={styles.title}>Запись создана! 🎉</Text>
      <Text style={styles.subtitle}>
        Мы свяжемся с вами для подтверждения времени визита.
      </Text>
      <Button title="На главную" onPress={() => router.replace('/(tabs)')} />
    </View>
  );
}
