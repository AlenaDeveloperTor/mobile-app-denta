import type { Service } from './service';

export type AppointmentStatus =
  | 'created'
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';

export interface Appointment {
  id: number | string;
  service_id: number | string;
  service_name?: string;
  phone?: string;
  service?: Service;
  date?: string;
  time?: string;
  status: AppointmentStatus;
  comment?: string;
  created_at?: string;
}

export interface CreateAppointmentInput {
  service_id: number;
  phone: string;
  comment?: string;
}
