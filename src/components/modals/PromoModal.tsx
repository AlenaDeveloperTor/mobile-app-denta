import { Button } from '@/components/common/Button';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { styles } from './PromoModal.styles';

interface PromoModalProps {
  promoId?: string;
}

interface Promo {
  id: string;
  title: string;
  description: string;
}

// Локальные акции (в реальном приложении — загрузка по promoId с API)
const PROMOS: Promo[] = [
  {
    id: '1',
    title: '🔥 Скидка 20% на имплантацию',
    description: 'До 31 августа. Запишитесь на консультацию уже сегодня!',
  },
  {
    id: '2',
    title: '⭐ Бесплатная диагностика',
    description: 'При первом посещении клиники - КТ и 3D-снимок в подарок',
  },
];

export function PromoModal({ promoId }: PromoModalProps) {
  const promo = PROMOS.find((p) => p.id === promoId) ?? PROMOS[0];

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>🎉 Акция!</Text>
        <Text style={styles.promoTitle}>{promo.title}</Text>
        <Text style={styles.promoDescription}>{promo.description}</Text>

        <Button
          title="Записаться"
          onPress={() => router.push({ pathname: '/modal', params: { type: 'booking' } })}
        />
        <Button title="Закрыть" variant="secondary" onPress={() => router.back()} />
      </View>
    </View>
  );
}
