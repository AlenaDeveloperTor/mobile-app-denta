import type { Appointment, AppointmentStatus } from '@/types/appointment';
import { formatDate } from '@/utils/formatters';
import { Text, TouchableOpacity, View, type ViewStyle } from 'react-native';
import { styles } from './AppointmentCard.styles';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  onCancel?: () => void;
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Ожидает подтверждения',
  confirmed: 'Подтверждена',
  cancelled: 'Отменена',
  completed: 'Завершена',
};

const STATUS_STYLES: Record<AppointmentStatus, ViewStyle> = {
  pending: styles.statusPending,
  confirmed: styles.statusConfirmed,
  cancelled: styles.statusCancelled,
  completed: styles.statusCompleted,
};

export function AppointmentCard({ appointment, onPress, onCancel }: AppointmentCardProps) {
  const canCancel =
    onCancel && appointment.status !== 'cancelled' && appointment.status !== 'completed';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{formatDate(appointment.date)}</Text>
          <Text style={styles.timeText}>{appointment.time}</Text>
        </View>
        <View style={[styles.statusBadge, STATUS_STYLES[appointment.status]]}>
          <Text style={styles.statusText}>{STATUS_LABELS[appointment.status]}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.serviceName}>
          {appointment.service?.name ?? 'Услуга'}
        </Text>
        {appointment.comment ? (
          <Text style={styles.comment} numberOfLines={2}>
            {appointment.comment}
          </Text>
        ) : null}
      </View>

      {canCancel ? (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Отменить запись</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}
