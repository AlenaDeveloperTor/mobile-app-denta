import { useAppointmentStore } from '@/store/useAppointmentStore';
import { appointmentsAPI } from '@/api/appointments';
import { Button } from '@/components/common/Button';
import type { Appointment, AppointmentStatus } from '@/types/appointment';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './AppointmentDetailModal.styles';

const STATUS_LABELS: Record<AppointmentStatus, string> = {
	created: 'Создана',
	pending: 'Ожидает подтверждения',
	confirmed: 'Подтверждена',
	cancelled: 'Отменена',
	completed: 'Завершена',
};

interface AppointmentDetailModalProps {
	appointmentId?: string;
}

export function AppointmentDetailModal({ appointmentId }: AppointmentDetailModalProps) {
	const storeAppointments = useAppointmentStore((s) => s.appointments);
	const setStoreAppointments = useAppointmentStore((s) => s.setAppointments);

	const foundInStore = storeAppointments.find(
		(a) => String(a.id) === String(appointmentId)
	);

	const [appointment, setAppointment] = useState<Appointment | null>(foundInStore ?? null);
	const [loading, setLoading] = useState(!foundInStore);
	const [error, setError] = useState(false);

	useEffect(() => {
		let active = true;

		async function load() {
			if (!appointmentId) {
				setLoading(false);
				setError(true);
				return;
			}

			if (foundInStore) {
				setAppointment(foundInStore);
				setLoading(false);
				return;
			}

			try {
				const response = await appointmentsAPI.getList();
				const items = response.data;
				if (Array.isArray(items)) {
					setStoreAppointments(items);
					const item = items.find((a) => String(a.id) === String(appointmentId));
					if (active) {
						if (item) {
							setAppointment(item);
						} else {
							setError(true);
						}
					}
				} else if (active) {
					setError(true);
				}
			} catch {
				if (active) setError(true);
			} finally {
				if (active) setLoading(false);
			}
		}

		load();
		return () => {
			active = false;
		};
	}, [appointmentId, foundInStore, setStoreAppointments]);

	if (loading) {
		return (
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<ActivityIndicator color="#172933" />
				</View>
			</View>
		);
	}

	if (error || !appointment) {
		return (
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.notFound}>Не удалось загрузить запись</Text>
					<Button title="Закрыть" variant="secondary" onPress={() => router.back()} />
				</View>
			</View>
		);
	}

	const serviceName = appointment.service?.name ?? appointment.service_name ?? 'Услуга не указана';
	const dateValue = appointment.appointment_datetime ?? appointment.date;
	const dateText = dateValue
		? appointment.appointment_datetime
			? formatDateTime(appointment.appointment_datetime)
			: `${formatDate(dateValue)}${appointment.time ? `, ${appointment.time}` : ''}`
		: 'Дата уточняется';

	return (
		<View style={styles.modalContainer}>
			<View style={styles.modalContent}>
				<View style={styles.header}>
					<Text style={styles.title}>Детали записи</Text>
					<TouchableOpacity onPress={() => router.back()} style={styles.closeButton} hitSlop={10}>
						<Ionicons name="close" size={24} color="#666" />
					</TouchableOpacity>
				</View>

				<ScrollView showsVerticalScrollIndicator={false}>
					<Text style={styles.serviceName}>{serviceName}</Text>
					<View style={styles.infoBlock}>
						<Text style={styles.label}>Дата и время</Text>
						<Text style={styles.value}>{dateText}</Text>
					</View>
					<View style={styles.infoBlock}>
						<Text style={styles.label}>Статус</Text>
						<Text style={styles.value}>{STATUS_LABELS[appointment.status]}</Text>
					</View>
					{appointment.comment ? (
						<View style={styles.infoBlock}>
							<Text style={styles.label}>Комментарий</Text>
							<Text style={styles.value}>{appointment.comment}</Text>
						</View>
					) : null}
					<Button title="Закрыть" variant="secondary" onPress={() => router.back()} />
				</ScrollView>
			</View>
		</View>
	);
}
