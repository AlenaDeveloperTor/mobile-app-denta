import { Button } from '@/components/common/Button';
import { styles } from '@/styles/appointmentSuccess';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

export default function AppointmentSuccessScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={48} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>Запись создана!</Text>
      <Text style={styles.subtitle}>
        Мы свяжемся с вами для подтверждения времени визита.
      </Text>
      <Button title="На главную" onPress={() => router.replace('/(tabs)')} />
    </View>
  );
}
