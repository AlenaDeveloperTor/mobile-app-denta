import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAppointments } from '@/hooks/useAppointments';
import { useBookingModalStore } from '@/store/useBookingModalStore';
import { styles } from '@/styles/appointments';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Text, View } from 'react-native';

export default function AppointmentsScreen() {
  const { appointments, loading, error, refreshing, refresh, cancel } = useAppointments();
  const openBooking = useBookingModalStore((s) => s.open);

  if (loading && appointments.length === 0) {
    return <LoadingSpinner />;
  }

  if (appointments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={64} color="#C7C7CC" />
        <Text style={styles.emptyTitle}>Записей пока нет</Text>
        <Text style={styles.emptyText}>
          Запишитесь к врачу, чтобы видеть свои визиты здесь
        </Text>
        <Button title="Записаться" onPress={() => openBooking()} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={appointments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <AppointmentCard appointment={item} onCancel={() => cancel(String(item.id))} />
      )}
      refreshing={refreshing}
      onRefresh={refresh}
      ListHeaderComponent={
        error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null
      }
    />
  );
}
