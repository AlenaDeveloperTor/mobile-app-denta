import type { Service } from './service';

export type AppointmentStatus =
  | 'created'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

/** Краткая информация о пациенте, вложенная в запись */
export interface AppointmentPatient {
  id: number;
  phone: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
}

export interface Appointment {
  id: number | string;
  user_id?: number;
  service_id: number | string;
  /** Единое поле даты-времени записи (ISO 8601), заполняется при подтверждении */
  appointment_datetime?: string;
  status: AppointmentStatus;
  comment?: string;
  created_at?: string;
  /** Вложенный объект услуги (из бэкенда) */
  service?: Service;
  /** Вложенный объект пациента (из бэкенда, может быть null) */
  patient?: AppointmentPatient;
  // --- Устаревшие демо-поля (для обратной совместимости) ---
  /** @deprecated Используйте appointment_datetime */
  date?: string;
  /** @deprecated Используйте appointment_datetime */
  time?: string;
  /** @deprecated Используйте service?.name */
  service_name?: string;
  phone?: string;
}

export interface CreateAppointmentInput {
  service_id: number;
  phone: string;
  comment?: string;
}
