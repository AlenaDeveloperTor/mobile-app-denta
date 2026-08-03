import { BookingModal } from './BookingModal';
import { ConfirmModal } from './ConfirmModal';
import { PromoModal } from './PromoModal';

export type ModalType = 'booking' | 'confirm' | 'promo';

export interface ModalRendererProps {
  type?: string;
  serviceId?: string;
  message?: string;
  promoId?: string;
}

/** Выбирает и рендерит нужную модалку по параметру type */
export function ModalRenderer({ type, serviceId, message, promoId }: ModalRendererProps) {
  switch (type) {
    case 'confirm':
      return <ConfirmModal message={message} />;
    case 'promo':
      return <PromoModal promoId={promoId} />;
    case 'booking':
    default:
      return <BookingModal serviceId={serviceId} />;
  }
}

export { BookingModal, ConfirmModal, PromoModal };

