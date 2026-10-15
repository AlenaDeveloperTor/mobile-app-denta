import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { styles } from '@/styles/birthDate';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '@/constants/theme';

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

function padTwo(n: string) {
  return n.length === 1 ? `0${n}` : n;
}

function isValidDate(day: string, month: string, year: string): boolean {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!d || !m || !y) return false;
  if (m < 1 || m > 12) return false;
  if (d < 1 || d > 31) return false;
  if (y < 1900 || y > new Date().getFullYear()) return false;
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

export default function BirthDateScreen() {
  const { updateProfile } = useAuthStore();

  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);

  const formattedDate = (() => {
    const d = day.padStart(2, '0');
    const m = month.padStart(2, '0');
    if (day && month && year.length === 4) {
      const mName = MONTHS[parseInt(month, 10) - 1] ?? '';
      return `${d} ${mName} ${year}`;
    }
    if (day && month) return `${d}.${m}`;
    if (day) return `${d}`;
    return '—';
  })();

  const handleSave = async () => {
    if (!isValidDate(day, month, year)) {
      Alert.alert('Ошибка', 'Пожалуйста, введите корректную дату рождения.');
      return;
    }
    const isoDate = `${year}-${padTwo(month)}-${padTwo(day)}`;
    setLoading(true);
    try {
      await updateProfile({ birth_date: isoDate });
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить дату рождения. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Иконка */}
        <View style={styles.iconWrapper}>
          <Text style={styles.iconText}>🎂</Text>
        </View>

        <Text style={styles.title}>Дата рождения</Text>
        <Text style={styles.subtitle}>
          Укажите вашу дату рождения, чтобы мы могли поздравить вас с праздником и подготовить персональные предложения.
        </Text>

        {/* Превью введённой даты */}
        <View style={styles.dateCard}>
          <Text style={styles.dateCardLabel}>Выбранная дата</Text>
          <Text style={styles.dateCardValue}>{formattedDate}</Text>
        </View>

        {/* Поля ввода */}
        <View style={styles.pickerRow}>
          {/* День */}
          <View style={styles.pickerCol}>
            <Text style={styles.pickerColLabel}>День</Text>
            <TextInput
              style={styles.pickerInput}
              value={day}
              onChangeText={(t) => setDay(t.replace(/\D/g, '').slice(0, 2))}
              placeholder="01"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              maxLength={2}
              textAlign="center"
            />
          </View>

          {/* Месяц */}
          <View style={styles.pickerCol}>
            <Text style={styles.pickerColLabel}>Месяц</Text>
            <TextInput
              style={styles.pickerInput}
              value={month}
              onChangeText={(t) => setMonth(t.replace(/\D/g, '').slice(0, 2))}
              placeholder="01"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              maxLength={2}
              textAlign="center"
            />
          </View>

          {/* Год */}
          <View style={[styles.pickerCol, { flex: 1.5 }]}>
            <Text style={styles.pickerColLabel}>Год</Text>
            <TextInput
              style={styles.pickerInput}
              value={year}
              onChangeText={(t) => setYear(t.replace(/\D/g, '').slice(0, 4))}
              placeholder="1990"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              maxLength={4}
              textAlign="center"
            />
          </View>
        </View>

        <Button
          title={loading ? 'Сохранение...' : 'Сохранить и продолжить'}
          onPress={handleSave}
          loading={loading}
        />

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Пропустить</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
