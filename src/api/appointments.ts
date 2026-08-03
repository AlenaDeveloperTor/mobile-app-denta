import type { Appointment, CreateAppointmentInput } from '@/types/appointment';
import { api } from './client';

export const appointmentsAPI = {
  /** Список записей текущего пользователя */
  getList: () => api.get<Appointment[]>('/appointments'),

  /** Запись по id */
  getById: (id: string) => api.get<Appointment>(`/appointments/${id}`),

  /** Создать запись */
  create: (input: CreateAppointmentInput) =>
    api.post<Appointment>('/appointments', input),

  /** Отменить запись */
  cancel: (id: string) =>
    api.delete<{ success: boolean }>(`/appointments/${id}`),
};
