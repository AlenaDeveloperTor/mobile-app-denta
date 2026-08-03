import { appointmentsAPI } from '@/api/appointments';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { normalizePhone } from '@/utils/formatters';
import { isValidName, isValidPhone } from '@/utils/validators';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './BookingModal.styles';

interface BookingModalProps {
  serviceId?: string;
}

export function BookingModal({ serviceId }: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; agreed?: string }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!isValidName(name)) {
      next.name = 'Укажите имя (минимум 2 символа)';
    }
    if (!isValidPhone(phone)) {
      next.phone = 'Укажите корректный номер телефона';
    }
    if (!agreed) {
      next.agreed = 'Необходимо согласие на обработку данных';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleBooking = async () => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      // В реальном приложении дата/время выбираются пользователем
      await appointmentsAPI.create({
        service_id: serviceId ?? '',
        date: new Date().toISOString().slice(0, 10),
        time: '10:00',
        comment: comment.trim() || undefined,
      });
      router.replace('/appointment-success');
    } catch {
      Alert.alert('Ошибка', 'Не удалось создать запись. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.modalContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.modalTitle}>✏️ Запись к врачу</Text>

          <Input
            label="ФИО *"
            value={name}
            onChangeText={setName}
            placeholder="Иванов Иван Иванович"
            error={errors.name}
          />
          <Input
            label="Телефон *"
            value={phone}
            onChangeText={(text) => setPhone(normalizePhone(text))}
            placeholder="+7 (999) 123-45-67"
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <Input
            label="Комментарий"
            value={comment}
            onChangeText={setComment}
            placeholder="Дополнительные пожелания"
            multiline
          />

          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
            <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={24} color="#007AFF" />
            <Text style={styles.checkboxText}>Я согласен с условиями обработки данных</Text>
          </TouchableOpacity>
          {errors.agreed ? <Text style={styles.errorText}>{errors.agreed}</Text> : null}

          <Button
            title={submitting ? 'Отправка...' : 'Записаться'}
            onPress={handleBooking}
            loading={submitting}
          />
          <Button title="Отмена" variant="secondary" onPress={() => router.back()} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
