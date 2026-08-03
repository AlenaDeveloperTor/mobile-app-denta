import type { Appointment } from '@/types/appointment';
import { create } from 'zustand';

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  setAppointments: (items: Appointment[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAppointment: (item: Appointment) => void;
  updateAppointment: (id: string, changes: Partial<Appointment>) => void;
  removeAppointment: (id: string) => void;
  clear: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  appointments: [],
  loading: false,
  error: null,
  setAppointments: (items) => set({ appointments: items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addAppointment: (item) =>
    set((state) => ({ appointments: [item, ...state.appointments] })),
  updateAppointment: (id, changes) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...changes } : a)),
    })),
  removeAppointment: (id) =>
    set((state) => ({ appointments: state.appointments.filter((a) => a.id !== id) })),
  clear: () => set({ appointments: [], loading: false, error: null }),
}));
