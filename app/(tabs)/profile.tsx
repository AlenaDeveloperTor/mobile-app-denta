import { Button } from '@/components/common/Button';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { styles } from '@/styles/profile';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { balance, fetchBalance } = useLoyaltyStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user, fetchBalance]);

  const openLogoutConfirm = () => {
    setError(null);
    setConfirmVisible(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setError(null);
    try {
      // Сбрасываем данные, чтобы они не «протекали» между пользователями
      useLoyaltyStore.getState().clear();
      useAppointmentStore.getState().clear();
      await logout();
      setConfirmVisible(false);
      router.replace('/(auth)/phone');
    } catch (logoutError) {
      console.error('Ошибка при выходе:', logoutError);
      setError('Не удалось выйти из аккаунта. Попробуйте ещё раз.');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
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

        <Button title="Выйти из аккаунта" variant="secondary" onPress={openLogoutConfirm} />
      </ScrollView>

      {confirmVisible && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Выход из аккаунта</Text>
            <Text style={styles.confirmText}>Вы действительно хотите выйти?</Text>
            {error ? <Text style={styles.confirmError}>{error}</Text> : null}
            <View style={styles.confirmButtons}>
              <Button
                title="Отмена"
                variant="secondary"
                onPress={() => setConfirmVisible(false)}
                style={styles.confirmButton}
                disabled={loggingOut}
              />
              <Button
                title="Выйти"
                onPress={handleLogout}
                loading={loggingOut}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
}
