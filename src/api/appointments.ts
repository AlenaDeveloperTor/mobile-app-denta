import type { Appointment, CreateAppointmentInput } from '@/types/appointment';
import { api } from './client';

export const appointmentsAPI = {
  /** Список записей текущего пользователя */
  getList: () => api.get<Appointment[]>('/appointments/my'),

  /** Запись по id */
  getById: (id: string | number) => api.get<Appointment>(`/appointments/${id}`),

  /** Создать запись */
  create: (input: CreateAppointmentInput) =>
    api.post<Appointment>('/appointments', input),

  /** Отменить запись */
  cancel: (appointmentId: string | number) =>
    api.delete<{ id: number | string; status: string; message: string }>(
      `/appointments/${appointmentId}`
    ),
};
