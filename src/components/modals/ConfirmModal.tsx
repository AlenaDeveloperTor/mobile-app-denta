import { Button } from '@/components/common/Button';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { styles } from './ConfirmModal.styles';

interface ConfirmModalProps {
  message?: string;
  onConfirm?: () => Promise<void> | void;
}

export function ConfirmModal({ message, onConfirm }: ConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) {
      router.back();
      return;
    }
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>⚠️ Подтверждение</Text>
        <Text style={styles.confirmMessage}>
          {message || 'Вы уверены, что хотите выполнить это действие?'}
        </Text>

        <View style={styles.confirmButtons}>
          <Button
            title="Отмена"
            variant="secondary"
            onPress={() => router.back()}
            style={styles.confirmButton}
          />
          <Button
            title="Подтвердить"
            onPress={handleConfirm}
            loading={submitting}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </View>
  );
}
