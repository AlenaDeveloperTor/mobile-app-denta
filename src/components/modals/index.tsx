import { MessageDetailModal } from '@/components/messages/MessageDetailModal';
import { useBookingModalStore } from '@/store/useBookingModalStore';
import { useEffect } from 'react';
import { ConfirmModal } from './ConfirmModal';
import { PromoModal } from './PromoModal';

export type ModalType = 'booking' | 'confirm' | 'promo' | 'message';

export interface ModalRendererProps {
  type?: string;
  serviceId?: string;
  message?: string;
  promoId?: string;
  messageId?: string;
}

/**
 * Мост для обратной совместимости: если кто-то перейдёт на
 * /modal?type=booking — откроем глобальную модалку записи.
 */
function BookingModalBridge({ serviceId }: { serviceId?: string }) {
  const open = useBookingModalStore((s) => s.open);
  const close = useBookingModalStore((s) => s.close);

  useEffect(() => {
    open(serviceId);
    return () => close();
  }, [open, close, serviceId]);

  return null;
}

/** Выбирает и рендерит нужную модалку по параметру type */
export function ModalRenderer({
  type,
  serviceId,
  message,
  promoId,
  messageId,
}: ModalRendererProps) {
  switch (type) {
    case 'confirm':
      return <ConfirmModal message={message} />;
    case 'promo':
      return <PromoModal promoId={promoId} />;
    case 'message':
      return <MessageDetailModal messageId={messageId} />;
    case 'booking':
    default:
      return <BookingModalBridge serviceId={serviceId} />;
  }
}

export { ConfirmModal, MessageDetailModal, PromoModal };

