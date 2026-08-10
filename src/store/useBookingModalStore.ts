import { createRef } from 'react';
import type { View } from 'react-native';
import { create } from 'zustand';

/**
 * Глобальный реф на BlurTargetView из корневого layout.
 * Нужен, чтобы BlurView в оверлее записи мог размывать экраны под собой (Android).
 */
export const bookingBlurTargetRef = createRef<View | null>();

interface BookingModalState {
  isOpen: boolean;
  /** Услуга, выбранная по умолчанию (когда пришли из карточки услуги) */
  initialServiceId?: string;
  open: (serviceId?: string) => void;
  close: () => void;
}

/**
 * Стор глобальной модалки записи к врачу.
 * Открывается из любого экрана приложения и рендерится поверх всех экранов
 * (см. BookingModal в app/_layout.tsx).
 */
export const useBookingModalStore = create<BookingModalState>((set) => ({
  isOpen: false,
  initialServiceId: undefined,
  open: (serviceId) => set({ isOpen: true, initialServiceId: serviceId }),
  close: () => set({ isOpen: false, initialServiceId: undefined }),
}));
