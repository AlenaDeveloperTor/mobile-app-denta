import { appointmentsAPI } from '@/api/appointments';
import { getErrorMessage } from '@/api/client';
import { servicesAPI } from '@/api/services';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuthStore } from '@/store/useAuthStore';
import {
    bookingBlurTargetRef,
    useBookingModalStore,
} from '@/store/useBookingModalStore';
import type { Service } from '@/types/service';
import { formatPhoneInput, formatPrice, normalizePhone } from '@/utils/formatters';
import { isValidPhone } from '@/utils/validators';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
  Animated,
  FlatList,
  Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { styles } from './BookingModal.styles';

const defaultServiceImage = require('../../../assets/images/logo.png');

/**
 * Глобальная модалка записи к врачу.
 * Рендерится в корневом layout поверх всех экранов, приглушает фон
 * полупрозрачной подложкой + блюром (expo-blur).
 * Внутри: выбор услуги, телефон, комментарий и кнопка «Подтвердить».
 */
export function BookingModal() {
  const { isOpen, initialServiceId, close } = useBookingModalStore();
  const user = useAuthStore((state) => state.user);
  const scrollViewRef = useRef<ScrollView>(null);
  const stepAnimation = useRef(new Animated.Value(1)).current;

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service>();
  const [step, setStep] = useState<'service' | 'form'>('service');
  const [phone, setPhone] = useState('+7');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ service?: string; phone?: string }>({});

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(null);
    try {
      const res = await servicesAPI.getServices();
      const items = Array.isArray(res.data) ? res.data : [];
      setServices(items);
      return items;
    } catch (error) {
      const message = getErrorMessage(
        error,
        'Не удалось загрузить список услуг. Проверьте интернет-соединение.'
      );
      setServicesError(message);
      setServices([]);
      return [];
    } finally {
      setServicesLoading(false);
    }
  }, []);

  // Загрузка услуг и сброс формы при каждом открытии
  useEffect(() => {
    if (!isOpen) return;

    setPhone(formatPhoneInput(user?.phone ?? ''));
    setComment('');
    setErrors({});
    setSelectedService(undefined);
    setStep('service');
    stepAnimation.setValue(1);

    loadServices().then((items) => {
      if (initialServiceId && items.length > 0) {
        const found = items.find((item) => String(item.id) === String(initialServiceId));
        if (found) {
          setSelectedService(found);
          setStep('form');
        }
      }
    });
  }, [isOpen, initialServiceId, user?.phone, loadServices]);

  const validate = () => {
    const next: typeof errors = {};
    const serviceIdNum = selectedService ? Number(selectedService.id) : NaN;
    if (!selectedService || isNaN(serviceIdNum) || serviceIdNum <= 0) {
      next.service = 'Выберите услугу из списка';
    }
    if (!isValidPhone(phone)) {
      next.phone = 'Укажите корректный номер телефона';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate() || !selectedService) {
      return;
    }

    const serviceIdNum = Number(selectedService.id);
    if (isNaN(serviceIdNum) || serviceIdNum <= 0) {
      Alert.alert('Ошибка', 'Некорректный идентификатор услуги. Пожалуйста, выберите услугу заново.');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentsAPI.create({
        service_id: serviceIdNum,
        phone: normalizePhone(phone),
        comment: comment.trim() || undefined,
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

  const scrollToFocusedField = () => {
    requestAnimationFrame(() => scrollViewRef.current?.scrollToEnd({ animated: true }));
  };

  const changeStep = (nextStep: 'service' | 'form') => {
    Animated.timing(stepAnimation, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      stepAnimation.setValue(0);
      Animated.timing(stepAnimation, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleServicePress = (service: Service) => {
    setSelectedService(service);
    setErrors({});
    changeStep('form');
  };

  const animatedStepStyle = {
    opacity: stepAnimation,
    transform: [
      {
        translateX: stepAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
    ],
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          pointerEvents="box-none"
        >
          <View style={styles.modalCard}>
            <Animated.View style={[styles.stepContainer, animatedStepStyle]}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  {step === 'form' ? (
                    <TouchableOpacity
                      onPress={() => changeStep('service')}
                      style={styles.backButton}
                      hitSlop={10}
                    >
                      <Ionicons name="arrow-back" size={22} color="#172933" />
                    </TouchableOpacity>
                  ) : null}
                  <Text style={styles.title}>Запись к врачу</Text>
                </View>
                <TouchableOpacity onPress={close} style={styles.closeButton} hitSlop={10}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {step === 'service' ? (
                <View style={styles.serviceStep}>
                  <Text style={styles.label}>Выберите услугу</Text>
                  {servicesLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#AAC6EE" />
                    </View>
                  ) : servicesError ? (
                    <View style={styles.errorContainer}>
                      <Ionicons
                        name="cloud-offline-outline"
                        size={44}
                        color="#E57373"
                        style={styles.errorIcon}
                      />
                      <Text style={styles.errorTitle}>Не удалось загрузить список услуг</Text>
                      <Text style={styles.errorDescription}>{servicesError}</Text>
                      <View style={styles.retryButton}>
                        <Button title="Повторить попытку" onPress={loadServices} />
                      </View>
                    </View>
                  ) : (
                    <FlatList
                      data={services}
                      numColumns={2}
                      keyExtractor={(service) => String(service.id)}
                      columnWrapperStyle={styles.gridRow}
                      contentContainerStyle={styles.serviceGrid}
                      showsVerticalScrollIndicator
                      style={styles.serviceList}
                      renderItem={({ item: service }) => (
                        <TouchableOpacity
                          style={styles.serviceCard}
                          onPress={() => handleServicePress(service)}
                          activeOpacity={0.85}
                        >
                          <Image
                            source={service.image_url ? { uri: service.image_url } : defaultServiceImage}
                            style={styles.serviceCardImage}
                          />
                          <LinearGradient
                            colors={['transparent', 'rgba(23,41,51,0.9)']}
                            style={styles.serviceCardOverlay}
                          >
                            <Text style={styles.serviceCardName} numberOfLines={3}>
                              {service.name}
                            </Text>
                            <Text style={styles.serviceCardPrice}>
                              от {formatPrice(service.price)}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                          <Ionicons
                            name="medical-outline"
                            size={36}
                            color="#A0AAB0"
                            style={styles.errorIcon}
                          />
                          <Text style={styles.emptyText}>Список доступных услуг пока пуст</Text>
                        </View>
                      }
                    />
                  )}
                  {errors.service ? (
                    <Text style={styles.errorText}>{errors.service}</Text>
                  ) : null}
                </View>
              ) : (
                <ScrollView
                  ref={scrollViewRef}
                  contentContainerStyle={styles.formScrollContent}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="interactive"
                >
                  {selectedService ? (
                    <View style={styles.selectedServiceChip}>
                      <Image
                        source={
                          selectedService.image_url
                            ? { uri: selectedService.image_url }
                            : defaultServiceImage
                        }
                        style={styles.chipImage}
                      />
                      <View style={styles.chipInfo}>
                        <Text style={styles.chipLabel}>Выбранная услуга</Text>
                        <Text style={styles.chipName} numberOfLines={2}>
                          {selectedService.name}
                        </Text>
                      </View>
                    </View>
                  ) : null}
                  <Input
                    label="Телефон для связи"
                    value={phone}
                    onChangeText={(text) => setPhone(formatPhoneInput(text))}
                    placeholder="+7 (999) 123-45-67"
                    keyboardType="phone-pad"
                    maxLength={18}
                    error={errors.phone}
                    onFocus={scrollToFocusedField}
                  />
                  <Input
                    label="Комментарий"
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Дополнительные пожелания"
                    multiline
                    onFocus={scrollToFocusedField}
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
              )}
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </View>
  );
}
