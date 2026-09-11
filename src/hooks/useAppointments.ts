import { appointmentsAPI } from '@/api/appointments';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useCallback, useEffect, useState } from 'react';

function sortAppointments(items: ReturnType<typeof useAppointmentStore.getState>['appointments']) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.appointment_datetime ?? left.created_at ?? 0).getTime();
    const rightTime = new Date(right.appointment_datetime ?? right.created_at ?? 0).getTime();
    return rightTime - leftTime;
  });
}

export function useAppointments() {
  const { appointments, loading, error, setAppointments, setLoading, setError } =
    useAppointmentStore();
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentsAPI.getList();
      setAppointments(sortAppointments(res.data));
    } catch {
      setError('Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  }, [setAppointments, setLoading, setError]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const cancel = useCallback(
    async (id: string) => {
      try {
        await appointmentsAPI.cancel(id);
        await load();
      } catch {
        setError('Не удалось отменить запись');
      }
    },
    [load, setError]
  );

  return { appointments, loading, error, refreshing, refresh, cancel };
}
