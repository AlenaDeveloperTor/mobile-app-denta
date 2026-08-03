import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './profile.styles';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { balance, fetchBalance } = useLoyaltyStore();

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user, fetchBalance]);

  const handleLogout = () => {
    Alert.alert('Выход', 'Вы действительно хотите выйти?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/phone');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={40} color="#FFFFFF" />
      </View>
      <Text style={styles.name}>
        {user?.first_name ?? ''} {user?.last_name ?? ''}
      </Text>
      <Text style={styles.phone}>{user?.phone ?? ''}</Text>

      <View style={styles.balanceCard}>
        <Ionicons name="gift-outline" size={24} color="#FF6B35" />
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Бонусный баланс</Text>
          <Text style={styles.balanceValue}>{balance} баллов</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push('/(tabs)/appointments')}
      >
        <Ionicons name="calendar-outline" size={22} color="#007AFF" />
        <Text style={styles.menuText}>Мои записи</Text>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>

      <Button title="Выйти из аккаунта" variant="secondary" onPress={handleLogout} />
    </ScrollView>
  );
}
