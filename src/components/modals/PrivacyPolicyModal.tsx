import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { openPrivacyPolicy } from '@/utils/policy';
import { styles } from './PrivacyPolicyModal.styles';
import { COLORS } from '@/constants/theme';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
  onAccept,
  showAcceptButton = false,
}) => {
  const handleOpenBrowser = async () => {
    await openPrivacyPolicy();
  };

  const handleAccept = () => {
    onAccept?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.headerTitle} numberOfLines={2}>
              Политика обработки персональных данных
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={8}
              style={styles.closeBtn}
              accessibilityLabel="Закрыть"
            >
              <Ionicons name="close" size={20} color={COLORS.dark} />
            </TouchableOpacity>
          </View>

          {/* Кнопка открытия полной версии на сайте */}
          <TouchableOpacity
            style={styles.browserLinkButton}
            onPress={handleOpenBrowser}
            activeOpacity={0.7}
          >
            <Ionicons name="open-outline" size={18} color={COLORS.dark} />
            <Text style={styles.browserLinkText}>Открыть документ на сайте клиники</Text>
          </TouchableOpacity>

          {/* Текст политики */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
          >
            <View style={styles.introBadge}>
              <Text style={styles.introBadgeText}>
                В соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ
                «О персональных данных».
              </Text>
            </View>

            <Text style={styles.sectionTitle}>1. Общие положения</Text>
            <Text style={styles.paragraph}>
              Настоящая Политика определяет порядок обработки и защиты персональных данных
              пользователей мобильного приложения стоматологической клиники LabSmile (далее — Оператор).
            </Text>
            <Text style={styles.paragraph}>
              Используя мобильное приложение и проходя авторизацию, пользователь выражает свое
              полное и информированное согласие на обработку персональных данных на условиях,
              изложенных в настоящем документе.
            </Text>

            <Text style={styles.sectionTitle}>2. Категории обрабатываемых данных</Text>
            <Text style={styles.paragraph}>
              В рамках функционирования приложения Оператор может обрабатывать следующие данные:
            </Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Номер мобильного телефона (для авторизации и связи);</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Фамилия, имя и отчество (при заполнении профиля);</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Дата рождения (для начисления бонусов и предложений);</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>История и параметры записей на прием к специалистам;</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Технический идентификатор устройства (для push-уведомлений).</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>3. Цели обработки данных</Text>
            <View style={styles.bulletList}>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Регистрация и подтверждение входа в личный кабинет;</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Онлайн-запись к врачам-стоматологам клиники;</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Отправка напоминаний о предстоящем визите;</Text>
              </View>
              <View style={styles.bulletItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.bulletText}>Участие в программе лояльности и начисление бонусов.</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>4. Защита и хранение</Text>
            <Text style={styles.paragraph}>
              Оператор принимает все необходимые организационные и технические меры для защиты
              персональных данных от неправомерного или случайного доступа. Все базы данных
              размещены на серверах на территории Российской Федерации.
            </Text>

            <Text style={styles.sectionTitle}>5. Срок действия и отзыв согласия</Text>
            <Text style={styles.paragraph}>
              Согласие действует бессрочно с момента предоставления и может быть отозвано
              пользователем в любой момент путем направления письменного заявления в клинику
              или через службу поддержки приложения.
            </Text>
          </ScrollView>

          {/* Кнопки внизу */}
          <View style={styles.footer}>
            {showAcceptButton ? (
              <>
                <Button
                  title="Закрыть"
                  variant="secondary"
                  onPress={onClose}
                  style={styles.footerBtn}
                />
                <Button
                  title="Принять"
                  onPress={handleAccept}
                  style={styles.footerBtn}
                />
              </>
            ) : (
              <Button
                title="Ознакомлен(а)"
                onPress={onClose}
                style={styles.footerBtn}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
