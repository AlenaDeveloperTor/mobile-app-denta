import type { Promo } from '@/types/service';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './PromoSection.styles';

const DEFAULT_PROMOS: Promo[] = [
  {
    id: 'default-1',
    title: '🔥 Скидка 20% на имплантацию',
    description: 'До 31 августа. Запишитесь на консультацию уже сегодня!',
    button_text: 'Узнать больше',
  },
  {
    id: 'default-2',
    title: '⭐ Бесплатная диагностика',
    description: 'При первом посещении клиники - КТ и 3D-снимок в подарок',
    button_text: 'Записаться',
  },
];

interface PromoSectionProps {
  promos: Promo[];
}

export function PromoSection({ promos }: PromoSectionProps) {
  const items = promos.length > 0 ? promos : DEFAULT_PROMOS;

  return (
    <View style={styles.promoSection}>
      <Text style={styles.sectionTitle}>🔥 Акции</Text>
      {items.map((promo) => (
        <TouchableOpacity
          key={promo.id}
          style={styles.promoCard}
          onPress={() => {
            router.push({
              pathname: '/modal',
              params: { type: 'promo', promoId: promo.id },
            });
          }}
        >
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>{promo.title}</Text>
            <Text style={styles.promoDescription}>{promo.description}</Text>
            <View style={styles.promoButton}>
              <Text style={styles.promoButtonText}>{promo.button_text}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
