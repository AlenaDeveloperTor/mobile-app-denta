import { Button } from '@/components/common/Button';
import { PrivacyPolicyModal } from '@/components/modals/PrivacyPolicyModal';
import { API_URL } from '@/config/env';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { styles } from '@/styles/profile';
import { formatDate, formatDateInput, parseDateInputToISO } from '@/utils/formatters';
import { openPrivacyPolicy } from '@/utils/policy';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function getFullAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = API_URL.replace(/\/api\/?$/, '');
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

export default function ProfileScreen() {
  const { user, logout, updateProfile, deleteAccount, uploadAvatar } = useAuthStore();
  const { balance, history, fetchBalance, setBalance } = useLoyaltyStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handlePickAvatar = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Доступ к фото',
          'Пожалуйста, разрешите доступ к галерее в настройках телефона, чтобы выбрать фото.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const filename = asset.fileName || asset.uri.split('/').pop() || 'avatar.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = asset.mimeType || (match ? `image/${match[1]}` : 'image/jpeg');

      const formData = new FormData();
      if (Platform.OS === 'web') {
        // В браузере (Expo Web) нужен реальный Blob
        const res = await fetch(asset.uri);
        const blob = await res.blob();
        formData.append('file', blob, filename);
      } else {
        // На нативном Android/iOS
        formData.append('file', {
          uri: asset.uri,
          name: filename,
          type: mimeType,
        } as any);
      }

      setUploadingAvatar(true);
      await uploadAvatar(formData);
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить фото профиля. Попробуйте ещё раз.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleOpenPolicy = async () => {
    await openPrivacyPolicy(() => {
      setPolicyModalVisible(true);
    });
  };

  // ── Редактирование профиля ─────────────────────────────────────────────
  const [editVisible, setEditVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Открываем форму и заполняем текущими значениями
  const openEdit = () => {
    setFirstName(user?.first_name ?? '');
    setLastName(user?.last_name ?? '');
    setPatronymic(user?.patronymic ?? '');
    setEmail(user?.email ?? '');
    if (user?.birth_date) {
      const parts = user.birth_date.split('-');
      if (parts.length === 3) {
        setBirthDate(`${parts[2]}.${parts[1]}.${parts[0]}`);
      } else {
        setBirthDate(user.birth_date);
      }
    } else {
      setBirthDate('');
    }
    setSaveError(null);
    setEditVisible(true);
  };

  const cancelEdit = () => {
    setEditVisible(false);
    setSaveError(null);
    setBirthDate('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    let isoBirthDate: string | undefined = undefined;
    if (birthDate.trim()) {
      const parsed = parseDateInputToISO(birthDate);
      if (!parsed) {
        setSaveError('Введите корректную дату рождения (ДД.ММ.ГГГГ)');
        setSaving(false);
        return;
      }
      isoBirthDate = parsed;
    }

    try {
      await updateProfile({
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        patronymic: patronymic.trim() || undefined,
        email: email.trim() || undefined,
        birth_date: isoBirthDate,
      });
      setEditVisible(false);
    } catch {
      setSaveError('Не удалось сохранить. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  };

  // ── Бонусы ─────────────────────────────────────────────────────────────
  // Загружаем баланс при фокусе на экран и при изменении пользователя
  useFocusEffect(
    useCallback(() => {
      if (user) {
        // Синхронизируем баланс из профиля пользователя
        if (user.loyalty_balance !== undefined) {
          setBalance(user.loyalty_balance);
        }
        // Обновляем полную информацию о бонусах с сервера
        fetchBalance().catch(console.error);

        // Периодически обновляем баланс (каждые 30 сек) для синхронизации с бэком
        const interval = setInterval(() => {
          fetchBalance().catch(console.error);
        }, 30000);

        return () => clearInterval(interval);
      }
    }, [user, fetchBalance, setBalance])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user) {
        await fetchBalance();
      }
    } catch (error) {
      console.error('Ошибка при обновлении бонусов:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // ── Выход ──────────────────────────────────────────────────────────────
  const openLogoutConfirm = () => {
    setLogoutError(null);
    setConfirmVisible(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      useLoyaltyStore.getState().clear();
      useAppointmentStore.getState().clear();
      await logout();
      setConfirmVisible(false);
      router.replace('/(auth)/phone');
    } catch (logoutError) {
      console.error('Ошибка при выходе:', logoutError);
      setLogoutError('Не удалось выйти из аккаунта. Попробуйте ещё раз.');
    } finally {
      setLoggingOut(false);
    }
  };

  // ── Удаление аккаунта ──────────────────────────────────────────────────
  const openDeleteConfirm = () => {
    setDeleteError(null);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      useLoyaltyStore.getState().clear();
      useAppointmentStore.getState().clear();
      await deleteAccount();
      setDeleteConfirmVisible(false);
      router.replace('/(auth)/phone');
    } catch {
      setDeleteError('Не удалось удалить аккаунт. Попробуйте ещё раз.');
    } finally {
      setDeleting(false);
    }
  };

  // ── Отображаемое имя и аватарка ─────────────────────────────────────────
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');
  const avatarUrl = getFullAvatarUrl(user?.avatar_url);

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Аватар с возможностью выбора фото */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={handlePickAvatar}
          disabled={uploadingAvatar}
          activeOpacity={0.8}
        >
          <View style={styles.avatar}>
            {uploadingAvatar ? (
              <View style={styles.avatarPlaceholder}>
                <ActivityIndicator size="small" color="#172933" />
              </View>
            ) : avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <LinearGradient
                colors={['#AAC6EE', '#D0C8B5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Ionicons name="person" size={42} color="#172933" />
              </LinearGradient>
            )}
          </View>
          <View style={styles.avatarBadge}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{displayName || 'Профиль'}</Text>
        <Text style={styles.phone}>{user?.phone ?? ''}</Text>

        {/* Дата рождения пользователя */}
        {user?.birth_date ? (
          <View style={styles.birthDateBadge}>
            <Ionicons name="gift-outline" size={15} color="#64748B" />
            <Text style={styles.birthDateText}>
              {formatDate(user.birth_date)}
            </Text>
          </View>
        ) : null}

        {/* Кнопка редактирования */}
        {!editVisible && (
          <TouchableOpacity style={styles.editProfileBtn} onPress={openEdit} activeOpacity={0.75}>
            <Ionicons name="pencil-outline" size={14} color="#172933" />
            <Text style={styles.editProfileBtnText}>Редактировать профиль</Text>
          </TouchableOpacity>
        )}

        {/* Форма редактирования */}
        {editVisible && (
          <View style={styles.editForm}>
            <Text style={styles.editFormTitle}>Редактировать профиль</Text>

            <Text style={styles.fieldLabel}>Имя</Text>
            <TextInput
              style={[styles.fieldInput, focusedField === 'firstName' && styles.fieldInputFocused]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Введите имя"
              placeholderTextColor="#B0BAC9"
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Фамилия</Text>
            <TextInput
              style={[styles.fieldInput, focusedField === 'lastName' && styles.fieldInputFocused]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Введите фамилию"
              placeholderTextColor="#B0BAC9"
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Отчество</Text>
            <TextInput
              style={[styles.fieldInput, focusedField === 'patronymic' && styles.fieldInputFocused]}
              value={patronymic}
              onChangeText={setPatronymic}
              placeholder="Введите отчество"
              placeholderTextColor="#B0BAC9"
              onFocus={() => setFocusedField('patronymic')}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.fieldInput, focusedField === 'email' && styles.fieldInputFocused]}
              value={email}
              onChangeText={setEmail}
              placeholder="example@mail.ru"
              placeholderTextColor="#B0BAC9"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>Дата рождения</Text>
            <TextInput
              style={[styles.fieldInput, focusedField === 'birthDate' && styles.fieldInputFocused]}
              value={birthDate}
              onChangeText={(text) => setBirthDate(formatDateInput(text))}
              placeholder="ДД.ММ.ГГГГ"
              placeholderTextColor="#B0BAC9"
              onFocus={() => setFocusedField('birthDate')}
              onBlur={() => setFocusedField(null)}
              keyboardType="number-pad"
              maxLength={10}
            />

            {saveError ? <Text style={styles.editFormError}>{saveError}</Text> : null}

            <View style={styles.editFormButtons}>
              <Button
                title="Отмена"
                variant="secondary"
                onPress={cancelEdit}
                style={styles.editFormBtn}
                disabled={saving}
              />
              <Button
                title="Сохранить"
                onPress={handleSave}
                loading={saving}
                style={styles.editFormBtn}
              />
            </View>
          </View>
        )}

      
        {/* Карточка бонусного баланса */}
        <View style={styles.balanceCard}>
          <Ionicons name="gift-outline" size={26} color="#AAC6EE" />
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Бонусный баланс</Text>
            <Text style={styles.balanceValue}>{balance} баллов</Text>
          </View>
        </View>

        {/* История баллов */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>История баллов</Text>
            {history.map((tx) => {
              const isPlus = tx.amount >= 0;
              return (
                <View key={tx.id} style={styles.historyItem}>
                  <View style={[styles.historyDot, isPlus ? styles.historyDotPlus : styles.historyDotMinus]}>
                    <Ionicons
                      name={isPlus ? 'arrow-up-outline' : 'arrow-down-outline'}
                      size={18}
                      color={isPlus ? '#388E3C' : '#D32F2F'}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyReason}>{tx.reason}</Text>
                    <Text style={styles.historyDate}>
                      {new Date(tx.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                  <Text style={[styles.historyAmount, isPlus ? styles.historyAmountPlus : styles.historyAmountMinus]}>
                    {isPlus ? '+' : ''}{tx.amount}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/appointments')}
        >
          <Ionicons name="calendar-outline" size={22} color="#AAC6EE" />
          <Text style={styles.menuText}>Мои записи</Text>
          <Ionicons name="chevron-forward" size={20} color="#AAC6EE" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleOpenPolicy}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color="#AAC6EE" />
          <Text style={styles.menuText}>Политика конфиденциальности</Text>
          <Ionicons name="chevron-forward" size={20} color="#AAC6EE" />
        </TouchableOpacity>

        <Button title="Выйти из аккаунта" variant="secondary" onPress={openLogoutConfirm} />

        {/* Раздел Дополнительно с шевроном */}
        <TouchableOpacity
          style={styles.advancedToggle}
          onPress={() => setAdvancedOpen((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Text style={styles.advancedToggleText}>Дополнительно</Text>
          <Ionicons
            name={advancedOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#6B7A8F"
          />
        </TouchableOpacity>

        {advancedOpen && (
          <View style={styles.advancedContent}>
            <Text style={styles.versionText}>Версия 1.0.0</Text>
            <Button
              title="Удалить аккаунт"
              variant="danger"
              onPress={openDeleteConfirm}
              style={styles.compactDeleteBtn}
            />
          </View>
        )}
      </ScrollView>

      {confirmVisible && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Выход из аккаунта</Text>
            <Text style={styles.confirmText}>Вы действительно хотите выйти?</Text>
            {logoutError ? <Text style={styles.confirmError}>{logoutError}</Text> : null}
            <View style={styles.confirmButtons}>
              <Button
                title="Отмена"
                variant="secondary"
                onPress={() => setConfirmVisible(false)}
                style={styles.confirmButton}
                disabled={loggingOut}
              />
              <Button
                title="Выйти"
                onPress={handleLogout}
                loading={loggingOut}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      )}

      <PrivacyPolicyModal
        visible={policyModalVisible}
        onClose={() => setPolicyModalVisible(false)}
      />

      {/* Модалка подтверждения удаления аккаунта */}
      {deleteConfirmVisible && (
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Удалить аккаунт?</Text>
            <Text style={styles.confirmText}>
              Это действие необратимо. Все ваши данные, история записей и бонусный баланс будут безвозвратно удалены.
            </Text>
            {deleteError ? <Text style={styles.confirmError}>{deleteError}</Text> : null}
            <View style={styles.confirmButtons}>
              <Button
                title="Отмена"
                variant="secondary"
                onPress={() => setDeleteConfirmVisible(false)}
                style={styles.confirmButton}
                disabled={deleting}
              />
              <Button
                title="Удалить"
                onPress={handleDeleteAccount}
                loading={deleting}
                style={[styles.confirmButton, styles.deleteConfirmBtn]}
              />
            </View>
          </View>
        </View>
      )}
    </>
  );
}
