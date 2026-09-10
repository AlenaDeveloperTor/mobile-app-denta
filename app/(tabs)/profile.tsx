import { Button } from '@/components/common/Button';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLoyaltyStore } from '@/store/useLoyaltyStore';
import { styles } from '@/styles/profile';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();
  const { balance, history, fetchBalance, setBalance } = useLoyaltyStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── Редактирование профиля ─────────────────────────────────────────────
  const [editVisible, setEditVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Открываем форму и заполняем текущими значениями
  const openEdit = () => {
    setFirstName(user?.first_name ?? '');
    setLastName(user?.last_name ?? '');
    setPatronymic(user?.patronymic ?? '');
    setEmail(user?.email ?? '');
    setSaveError(null);
    setEditVisible(true);
  };

  const cancelEdit = () => {
    setEditVisible(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateProfile({
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        patronymic: patronymic.trim() || undefined,
        email: email.trim() || undefined,
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

  // ── Отображаемое имя ───────────────────────────────────────────────────
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Аватар с градиентом */}
        <View style={styles.avatar}>
          <LinearGradient
            colors={['#AAC6EE', '#D0C8B5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: 88, height: 88, alignItems: 'center', justifyContent: 'center', borderRadius: 44 }}
          >
            <Ionicons name="person" size={42} color="#172933" />
          </LinearGradient>
        </View>

        <Text style={styles.name}>{displayName || 'Профиль'}</Text>
        <Text style={styles.phone}>{user?.phone ?? ''}</Text>

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

        <Button title="Выйти из аккаунта" variant="secondary" onPress={openLogoutConfirm} />
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
    </>
  );
}
