import type { Promo } from '@/types/service';
import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './PromoSection.styles';

interface PromoSectionProps {
  promos: Promo[];
}

export function PromoSection({ promos }: PromoSectionProps) {
  // Если акций нет — секцию не показываем вообще
  if (promos.length === 0) {
    return null;
  }

  return (
    <View style={styles.promoSection}>
      <Text style={styles.sectionTitle}>🔥 Акции</Text>
      {promos.map((promo) => (
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
