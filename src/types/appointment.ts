import type { Service } from './service';

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface Appointment {
  id: string;
  service_id: string;
  service?: Service;
  date: string; // ISO-дата
  time: string; // "HH:MM"
  status: AppointmentStatus;
  comment?: string;
  created_at?: string;
}

export interface CreateAppointmentInput {
  service_id: string;
  date: string;
  time: string;
  comment?: string;
}
