import { ModalRenderer } from '@/components/modals';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

// Экран-обёртка: читает параметры и рендерит нужную модалку
export default function ModalScreen() {
  const { type, serviceId, message, promoId, messageId, appointmentId } = useLocalSearchParams<{
    type?: string;
    serviceId?: string;
    message?: string;
    promoId?: string;
    messageId?: string;
    appointmentId?: string;
  }>();

  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <ModalRenderer
        type={type}
        serviceId={serviceId}
        message={message}
        promoId={promoId}
        messageId={messageId}
        appointmentId={appointmentId}
      />
    </>
  );
}

