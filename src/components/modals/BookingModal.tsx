import { appointmentsAPI } from '@/api/appointments';
import { getErrorMessage } from '@/api/client';
import { servicesAPI } from '@/api/services';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { DEFAULT_SERVICES } from '@/data/services';
import {
    bookingBlurTargetRef,
    useBookingModalStore,
} from '@/store/useBookingModalStore';
import type { Service } from '@/types/service';
import { formatDuration, formatPhoneInput, formatPrice, normalizePhone } from '@/utils/formatters';
import { isValidPhone } from '@/utils/validators';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './BookingModal.styles';

/**
 * Глобальная модалка записи к врачу.
 * Рендерится в корневом layout поверх всех экранов, приглушает фон
 * полупрозрачной подложкой + блюром (expo-blur).
 * Внутри: выбор услуги, телефон, комментарий и кнопка «Подтвердить».
 */
export function BookingModal() {
  const { isOpen, initialServiceId, close } = useBookingModalStore();

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [phone, setPhone] = useState('+7');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ service?: string; phone?: string }>({});

  // Загрузка списка услуг при первом открытии
  useEffect(() => {
    let active = true;
    setServicesLoading(true);
    servicesAPI
      .getServices()
      .then((res) => {
        if (!active) return;
        // Если API вернул пустой список — показываем демо-услуги
        const items = res.data.length > 0 ? res.data : DEFAULT_SERVICES;
        setServices(items);
        if (items[0]) {
          setSelectedServiceId((prev) => prev ?? items[0].id);
        }
      })
      .catch(() => {
        // Если API недоступен — тоже показываем демо-услуги для теста
        if (!active) return;
        setServices(DEFAULT_SERVICES);
        setSelectedServiceId((prev) => prev ?? DEFAULT_SERVICES[0]?.id);
      })
      .finally(() => {
        if (active) setServicesLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Сброс формы при каждом открытии
  useEffect(() => {
    if (!isOpen) return;
    setPhone('+7');
    setComment('');
    setErrors({});
    setSelectedServiceId(initialServiceId ?? services[0]?.id);
  }, [isOpen, initialServiceId, services]);

  const validate = () => {
    const next: typeof errors = {};
    if (!selectedServiceId) {
      next.service = 'Выберите услугу';
    }
    if (!isValidPhone(phone)) {
      next.phone = 'Укажите корректный номер телефона';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate() || !selectedServiceId) {
      return;
    }

    setSubmitting(true);
    try {
      await appointmentsAPI.create({
        service_id: Number(selectedServiceId),
        phone: normalizePhone(phone),
        comment: comment.trim() || '',
      });
      close();
      router.replace('/appointment-success');
    } catch (error) {
      Alert.alert(
        'Ошибка',
        getErrorMessage(error, 'Не удалось создать запись. Попробуйте позже.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <BlurView
        blurTarget={Platform.OS === 'android' ? bookingBlurTargetRef : undefined}
        blurMethod={Platform.OS === 'android' ? 'dimezisBlurViewSdk31Plus' : undefined}
        intensity={30}
        tint="dark"
        style={styles.backdrop}
      >
        {/* Подложка: тап вне карточки закрывает модалку */}
        <Pressable style={styles.backdropPressable} onPress={close} />

        <KeyboardAvoidingView
          style={styles.modalPositioner}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          pointerEvents="box-none"
        >
          <View style={styles.modalCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text style={styles.title}>✏️ Запись к врачу</Text>
                <TouchableOpacity onPress={close} style={styles.closeButton} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Выбор услуги */}
              <Text style={styles.label}>Вид услуги *</Text>
              {servicesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#AAC6EE" />
                </View>
              ) : (
                <View style={styles.serviceList}>
                  {services.map((service) => {
                    const selected = service.id === selectedServiceId;
                    return (
                      <TouchableOpacity
                        key={service.id}
                        style={[
                          styles.serviceItem,
                          selected && styles.serviceItemSelected,
                        ]}
                        onPress={() => setSelectedServiceId(service.id)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.serviceInfo}>
                          <Text style={styles.serviceName}>{service.name}</Text>
                          <Text style={styles.serviceMeta}>
                            {formatDuration(service.duration)} · от{' '}
                            {formatPrice(service.price)}
                          </Text>
                        </View>
                        <Ionicons
                          name={
                            selected ? 'radio-button-on' : 'radio-button-off'
                          }
                          size={22}
                          color={selected ? '#AAC6EE' : '#C7C7CC'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                  {!servicesLoading && services.length === 0 && (
                    <Text style={styles.emptyText}>Список услуг пока пуст</Text>
                  )}
                </View>
              )}
              {errors.service ? (
                <Text style={styles.errorText}>{errors.service}</Text>
              ) : null}

              <Input
                label="Телефон *"
                value={phone}
                onChangeText={(text) => setPhone(formatPhoneInput(text))}
                placeholder="+7 (999) 123-45-67"
                keyboardType="phone-pad"
                maxLength={18}
                error={errors.phone}
              />
              <Input
                label="Комментарий"
                value={comment}
                onChangeText={setComment}
                placeholder="Дополнительные пожелания"
                multiline
              />

              <Button
                title={submitting ? 'Отправка...' : 'Подтвердить'}
                onPress={handleConfirm}
                loading={submitting}
              />
              <View style={styles.cancelButton}>
                <Button title="Отмена" variant="secondary" onPress={close} />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </View>
  );
}
